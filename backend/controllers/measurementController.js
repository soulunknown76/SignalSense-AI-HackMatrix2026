import Measurement from '../models/Measurement.js';
import { INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';

let inMemoryMeasurements = [...INITIAL_MEASUREMENTS];

export const getMeasurements = async (req, res, next) => {
  try {
    const { carrier } = req.query;

    if (getDBStatus()) {
      const query = carrier && carrier !== 'All' ? { carrier } : {};
      const measurements = await Measurement.find(query).sort({ createdAt: -1 });
      return res.status(200).json(measurements);
    }

    // In-Memory Fallback
    let filtered = inMemoryMeasurements;
    if (carrier && carrier !== 'All') {
      filtered = filtered.filter(m => m.carrier.toLowerCase() === carrier.toLowerCase());
    }

    return res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
};

export const createMeasurement = async (req, res, next) => {
  try {
    const { lat, lng, carrier, signal, speed, upload, ping, reliability, time } = req.body;

    if (!lat || !lng || !carrier || signal === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: lat, lng, carrier, signal',
      });
    }

    const newDoc = {
      id: `m_${Date.now()}`,
      lat: Number(lat),
      lng: Number(lng),
      carrier,
      signal: Number(signal),
      speed: Number(speed || 10),
      upload: Number(upload || 3),
      ping: Number(ping || 35),
      reliability: Number(reliability || 90),
      time: time || 'Just now',
    };

    if (getDBStatus()) {
      const created = await Measurement.create(newDoc);
      return res.status(201).json({
        success: true,
        data: created,
      });
    }

    // Fallback in-memory insert
    inMemoryMeasurements.unshift(newDoc);
    return res.status(201).json({
      success: true,
      data: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const getHeatmap = async (req, res, next) => {
  try {
    let dataset = [];

    if (getDBStatus()) {
      dataset = await Measurement.find({});
    } else {
      dataset = inMemoryMeasurements;
    }

    const heatmap = dataset.map(m => ({
      lat: m.lat,
      lng: m.lng,
      intensity: Math.max(0.1, Math.min(1.0, (m.signal + 120) / 70)),
    }));

    return res.status(200).json(heatmap);
  } catch (error) {
    next(error);
  }
};
