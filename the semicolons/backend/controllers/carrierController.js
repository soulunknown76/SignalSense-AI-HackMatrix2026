import Carrier from '../models/Carrier.js';
import Measurement from '../models/Measurement.js';
import { INITIAL_CARRIERS, INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';
import { calculateCarrierRankings } from '../services/scoringEngine.js';
import { calculateDistanceMeters } from '../services/aiEngine.js';

export const getCarriers = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    let telemetry = [];

    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    if (telemetry.length > 0) {
      let filteredTelemetry = telemetry;

      // Filter by location proximity if lat and lng coordinates are provided
      if (!isNaN(lat) && !isNaN(lng)) {
        const nearby = telemetry.filter((m) => {
          const distMeters = calculateDistanceMeters(lat, lng, m.lat, m.lng);
          return distMeters <= 3500; // Within 3.5 km radius
        });

        if (nearby.length > 0) {
          filteredTelemetry = nearby;
        }
      }

      const dynamicRankings = calculateCarrierRankings(filteredTelemetry);
      return res.status(200).json(dynamicRankings);
    }

    if (getDBStatus()) {
      const carriers = await Carrier.find({}).sort({ rank: 1 });
      return res.status(200).json(carriers);
    }

    return res.status(200).json(INITIAL_CARRIERS);
  } catch (error) {
    next(error);
  }
};
