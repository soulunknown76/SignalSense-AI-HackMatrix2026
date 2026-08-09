import Carrier from '../models/Carrier.js';
import Measurement from '../models/Measurement.js';
import { INITIAL_CARRIERS, INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';
import { calculateCarrierRankings } from '../services/scoringEngine.js';

export const getCarriers = async (req, res, next) => {
  try {
    let telemetry = [];

    if (getDBStatus()) {
      telemetry = await Measurement.find({});
    } else {
      telemetry = INITIAL_MEASUREMENTS;
    }

    if (telemetry.length > 0) {
      const dynamicRankings = calculateCarrierRankings(telemetry);
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
