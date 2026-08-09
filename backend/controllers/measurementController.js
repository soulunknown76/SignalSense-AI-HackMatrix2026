import Measurement from '../models/Measurement.js';
import { INITIAL_MEASUREMENTS } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';

let inMemoryMeasurements = [...INITIAL_MEASUREMENTS];

const generateBackendRegionalPoints = (centerLat, centerLng) => {
  const carriers = ['Jio', 'Airtel', 'Vi', 'BSNL'];
  const times = ['2 mins ago', '5 mins ago', '12 mins ago', '18 mins ago', '25 mins ago', '34 mins ago'];
  const points = [];
  
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * 2 * Math.PI + 0.35;
    const dist = 0.0035 + ((i * 7 + 3) % 11) * 0.0024;
    
    const lat = Number((centerLat + Math.sin(angle) * dist).toFixed(5));
    const lng = Number((centerLng + Math.cos(angle) * dist).toFixed(5));
    const carrier = carriers[i % carriers.length];
    
    let baseSignal = -72;
    let baseSpeed = 48;
    if (carrier === 'Jio') { baseSignal = -68; baseSpeed = 58; }
    else if (carrier === 'Airtel') { baseSignal = -72; baseSpeed = 52; }
    else if (carrier === 'Vi') { baseSignal = -86; baseSpeed = 24; }
    else if (carrier === 'BSNL') { baseSignal = -96; baseSpeed = 10; }
    
    const signalVariation = ((i * 13) % 25) - 12;
    const signal = Math.min(-55, Math.max(-112, baseSignal + signalVariation));
    const speed = Math.max(2, Math.round(baseSpeed + ((i * 9) % 20) - 10));
    const upload = Math.max(1, Math.round(speed * 0.3));
    const ping = Math.max(14, Math.round(20 + (-signal - 60) * 1.2 + (i % 7)));
    const reliability = Math.max(40, Math.min(99, Math.round(100 - (-signal - 60) * 0.8)));
    
    points.push({
      id: `bg_${i}_${Math.round(lat*1000)}_${Math.round(lng*1000)}`,
      lat,
      lng,
      carrier,
      signal,
      speed,
      upload,
      ping,
      reliability,
      time: times[i % times.length]
    });
  }
  return points;
};

export const getMeasurements = async (req, res, next) => {
  try {
    const { carrier, lat, lng } = req.query;

    const targetLat = lat ? parseFloat(lat) : null;
    const targetLng = lng ? parseFloat(lng) : null;

    if (getDBStatus()) {
      const query = carrier && carrier !== 'All' ? { carrier } : {};
      const measurements = await Measurement.find(query).sort({ createdAt: -1 });
      if (measurements.length > 0) return res.status(200).json(measurements);
    }

    let dataset = inMemoryMeasurements;

    if (targetLat !== null && targetLng !== null) {
      const nearPoints = dataset.filter(
        m => Math.abs(m.lat - targetLat) < 0.1 && Math.abs(m.lng - targetLng) < 0.1
      );
      if (nearPoints.length > 0) {
        dataset = nearPoints;
      } else {
        dataset = generateBackendRegionalPoints(targetLat, targetLng);
      }
    }

    if (carrier && carrier !== 'All') {
      dataset = dataset.filter(m => m.carrier.toLowerCase() === carrier.toLowerCase());
    }

    return res.status(200).json(dataset);
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
    const { lat, lng } = req.query;
    let dataset = [];

    if (getDBStatus()) {
      dataset = await Measurement.find({});
    } else {
      dataset = inMemoryMeasurements;
    }

    if (lat && lng && dataset.length === 0) {
      dataset = generateBackendRegionalPoints(parseFloat(lat), parseFloat(lng));
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
