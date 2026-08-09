import Measurement from '../models/Measurement.js';
import { INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';
import { predictDeadZoneRisk, getBestCarrierRecommendation } from '../services/aiEngine.js';

export const getPrediction = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 25.181;
    const lng = parseFloat(req.query.lng) || 75.839;
    const { carrier, nodeId } = req.query;

    let telemetry = [];
    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    const prediction = predictDeadZoneRisk(lat, lng, telemetry, { carrier, nodeId });
    res.status(200).json(prediction);
  } catch (error) {
    next(error);
  }
};

export const getRecommendation = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 25.181;
    const lng = parseFloat(req.query.lng) || 75.839;
    const { carrier } = req.query;

    let telemetry = [];
    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    const rec = getBestCarrierRecommendation(lat, lng, telemetry, carrier);
    res.status(200).json(rec);
  } catch (error) {
    next(error);
  }
};
