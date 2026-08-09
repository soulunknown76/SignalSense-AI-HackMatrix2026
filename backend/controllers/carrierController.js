import Carrier from '../models/Carrier.js';
import { INITIAL_CARRIERS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';

export const getCarriers = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const carriers = await Carrier.find({}).sort({ rank: 1 });
      return res.status(200).json(carriers);
    }

    return res.status(200).json(INITIAL_CARRIERS);
  } catch (error) {
    next(error);
  }
};
