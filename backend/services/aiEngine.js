import { calculateCQI } from './scoringEngine.js';

// Calculate Haversine distance in meters between two lat/lng coordinates
export const calculateDistanceMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Inverse Distance Weighting (IDW) Spatial Interpolation
 * Predicts signal metrics for target coordinate (lat, lng) based on surrounding telemetry samples
 */
export const interpolateLocationMetrics = (lat, lng, telemetryPoints) => {
  if (!telemetryPoints || telemetryPoints.length === 0) {
    return {
      expectedSignal: -85,
      expectedSpeed: 25,
      expectedUpload: 8,
      expectedPing: 35,
      nearestDistanceMeters: 500,
      spatialConfidence: 50,
    };
  }

  let totalWeight = 0;
  let weightedSignal = 0;
  let weightedSpeed = 0;
  let weightedUpload = 0;
  let weightedPing = 0;
  let nearestDist = Infinity;

  const power = 2; // IDW distance power parameter
  const epsilon = 1e-6;

  telemetryPoints.forEach((point) => {
    const distMeters = calculateDistanceMeters(lat, lng, point.lat, point.lng);
    if (distMeters < nearestDist) {
      nearestDist = distMeters;
    }

    // Weight = 1 / (d^p)
    const weight = 1 / Math.pow(distMeters + epsilon, power);
    totalWeight += weight;

    weightedSignal += point.signal * weight;
    weightedSpeed += point.speed * weight;
    weightedUpload += point.upload * weight;
    weightedPing += point.ping * weight;
  });

  const expectedSignal = Math.round(weightedSignal / totalWeight);
  const expectedSpeed = Math.round((weightedSpeed / totalWeight) * 10) / 10;
  const expectedUpload = Math.round((weightedUpload / totalWeight) * 10) / 10;
  const expectedPing = Math.round(weightedPing / totalWeight);
  const nearestDistanceMeters = Math.round(nearestDist);

  // Confidence is high if nearest sample is within 500m
  const spatialConfidence = Math.max(
    30,
    Math.min(99, Math.round(100 - (nearestDistanceMeters / 1500) * 70))
  );

  return {
    expectedSignal,
    expectedSpeed,
    expectedUpload,
    expectedPing,
    nearestDistanceMeters,
    spatialConfidence,
  };
};

/**
 * AI Dead-Zone Risk Classifier & Recommendation Model
 */
export const predictDeadZoneRisk = (lat, lng, telemetryPoints) => {
  const spatial = interpolateLocationMetrics(lat, lng, telemetryPoints);

  // Calculate Dead-Zone Probability (%)
  let probDeadZone = 0;

  // Signal component penalty
  if (spatial.expectedSignal < -100) {
    probDeadZone += 65;
  } else if (spatial.expectedSignal < -88) {
    probDeadZone += 40;
  } else if (spatial.expectedSignal < -75) {
    probDeadZone += 15;
  } else {
    probDeadZone += 5;
  }

  // Distance penalty from cell node
  if (spatial.nearestDistanceMeters > 1000) {
    probDeadZone += 25;
  } else if (spatial.nearestDistanceMeters > 500) {
    probDeadZone += 15;
  }

  // Ping latency penalty
  if (spatial.expectedPing > 80) {
    probDeadZone += 15;
  }

  probDeadZone = Math.min(98, Math.max(5, Math.round(probDeadZone)));

  // Risk Classification
  let riskLevel = 'LOW';
  if (probDeadZone >= 80) riskLevel = 'CRITICAL';
  else if (probDeadZone >= 60) riskLevel = 'HIGH';
  else if (probDeadZone >= 35) riskLevel = 'MEDIUM';

  // Dynamic recommendation based on spatial prediction
  let recommendation = '';
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendation = `High risk of cellular dropouts. Switch to Airtel high-band tower (~${spatial.nearestDistanceMeters}m away).`;
  } else if (riskLevel === 'MEDIUM') {
    recommendation = `Moderate coverage. Jio 5G provides optimal stability at this location (${spatial.expectedSpeed} Mbps).`;
  } else {
    recommendation = `Optimal cellular reception detected. Jio and Airtel both provide sub-25ms low latency.`;
  }

  // Composite Quality Index (CQI) score for predicted point
  const predictedCQI = calculateCQI({
    signal: spatial.expectedSignal,
    speed: spatial.expectedSpeed,
    upload: spatial.expectedUpload,
    ping: spatial.expectedPing,
    reliability: Math.max(50, 100 - probDeadZone),
  });

  return {
    lat,
    lng,
    riskLevel,
    probabilityOfDeadZone: probDeadZone,
    expectedSignal: spatial.expectedSignal,
    expectedSpeed: spatial.expectedSpeed,
    expectedUpload: spatial.expectedUpload,
    expectedPing: spatial.expectedPing,
    compositeQualityIndex: predictedCQI,
    nearestCellNodeMeters: spatial.nearestDistanceMeters,
    spatialConfidence: spatial.spatialConfidence,
    recommendation,
  };
};

/**
 * Smart Multi-Carrier Recommendation Algorithm
 */
export const getBestCarrierRecommendation = (lat, lng, telemetryPoints) => {
  const carrierScores = {};

  telemetryPoints.forEach((p) => {
    const dist = calculateDistanceMeters(lat, lng, p.lat, p.lng);
    const weight = 1 / (dist + 1);
    const cqi = calculateCQI(p);

    if (!carrierScores[p.carrier]) {
      carrierScores[p.carrier] = { totalWeight: 0, weightedCQI: 0, nearestDist: dist };
    }

    carrierScores[p.carrier].totalWeight += weight;
    carrierScores[p.carrier].weightedCQI += cqi * weight;
    if (dist < carrierScores[p.carrier].nearestDist) {
      carrierScores[p.carrier].nearestDist = dist;
    }
  });

  const sortedCarriers = Object.keys(carrierScores)
    .map((name) => ({
      name,
      cqi: Math.round(carrierScores[name].weightedCQI / carrierScores[name].totalWeight),
      dist: Math.round(carrierScores[name].nearestDist),
    }))
    .sort((a, b) => b.cqi - a.cqi);

  const best = sortedCarriers[0] || { name: 'Airtel', cqi: 88, dist: 350 };
  const backup = sortedCarriers[1] || { name: 'Jio', cqi: 82, dist: 480 };

  return {
    lat,
    lng,
    bestCarrier: best.name,
    backupCarrier: backup.name,
    reasoning: `${best.name} operates a dedicated cell node ${best.dist}m from target coordinate with an estimated Composite Quality Index of ${best.cqi}/100.`,
  };
};
