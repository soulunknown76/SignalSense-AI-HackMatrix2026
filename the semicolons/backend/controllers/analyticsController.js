import Measurement from '../models/Measurement.js';
import { INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';
import { predictDeadZoneRisk } from '../services/aiEngine.js';
import { calculateCarrierRankings } from '../services/scoringEngine.js';

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    let telemetry = [];

    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    const totalMeasurements = telemetry.length;
    const avgSignal = Math.round(telemetry.reduce((acc, m) => acc + m.signal, 0) / (totalMeasurements || 1));
    const avgSpeed = Math.round((telemetry.reduce((acc, m) => acc + m.speed, 0) / (totalMeasurements || 1)) * 10) / 10;
    const avgPing = Math.round(telemetry.reduce((acc, m) => acc + m.ping, 0) / (totalMeasurements || 1));

    // Dynamic carrier rankings
    const rankings = calculateCarrierRankings(telemetry);
    const topCarrier = rankings[0]?.name || 'Jio';

    // Risk distribution calculation
    const risks = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    telemetry.forEach((m) => {
      const pred = predictDeadZoneRisk(m.lat, m.lng, telemetry);
      risks[pred.riskLevel] = (risks[pred.riskLevel] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalMeasurements,
        avgSignalDbm: avgSignal,
        avgDownloadSpeedMbps: avgSpeed,
        avgPingMs: avgPing,
        topPerformingCarrier: topCarrier,
        carrierRankings: rankings,
        deadZoneRiskDistribution: risks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const predictBatchRoute = async (req, res, next) => {
  try {
    const { points } = req.body;

    if (!points || !Array.isArray(points) || points.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid array of coordinate points [{ lat, lng }, ...]',
      });
    }

    let telemetry = [];
    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    const predictions = points.map((p) => {
      const lat = parseFloat(p.lat);
      const lng = parseFloat(p.lng);
      return predictDeadZoneRisk(lat, lng, telemetry);
    });

    // Calculate overall route risk
    const highRiskPoints = predictions.filter((p) => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL').length;
    const routeDeadZoneProbability = Math.round((highRiskPoints / predictions.length) * 100);

    res.status(200).json({
      success: true,
      pointCount: predictions.length,
      routeDeadZoneProbability,
      routeRiskStatus: routeDeadZoneProbability > 40 ? 'HIGH RISK ROUTE' : 'STABLE COVERAGE ROUTE',
      predictions,
    });
  } catch (error) {
    next(error);
  }
};
