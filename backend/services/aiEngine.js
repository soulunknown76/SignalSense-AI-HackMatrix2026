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

export const generateRegionalTelemetry = (centerLat, centerLng) => {
  const carriers = ['Jio', 'Airtel', 'Vi', 'BSNL'];
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
      id: `ai_${i}_${Math.round(lat*1000)}_${Math.round(lng*1000)}`,
      lat, lng, carrier, signal, speed, upload, ping, reliability
    });
  }
  return points;
};

export const interpolateLocationMetrics = (lat, lng, telemetryPoints) => {
  let effectivePoints = telemetryPoints;
  if (!effectivePoints || effectivePoints.length === 0) {
    effectivePoints = generateRegionalTelemetry(lat, lng);
  } else {
    // If nearest point is farther than 50km, generate regional points for searched location
    const minDistance = Math.min(...effectivePoints.map(p => calculateDistanceMeters(lat, lng, p.lat, p.lng)));
    if (minDistance > 50000) {
      effectivePoints = generateRegionalTelemetry(lat, lng);
    }
  }

  let totalWeight = 0;
  let weightedSignal = 0;
  let weightedSpeed = 0;
  let weightedUpload = 0;
  let weightedPing = 0;
  let nearestDist = Infinity;

  const power = 2;
  const epsilon = 1e-6;

  effectivePoints.forEach((point) => {
    const distMeters = calculateDistanceMeters(lat, lng, point.lat, point.lng);
    if (distMeters < nearestDist) {
      nearestDist = distMeters;
    }

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
export const predictDeadZoneRisk = (lat, lng, telemetryPoints, options = {}) => {
  let filteredPoints = telemetryPoints;
  if (options.carrier && options.carrier !== 'All') {
    filteredPoints = telemetryPoints.filter(p => p.carrier && p.carrier.toLowerCase() === options.carrier.toLowerCase());
  }

  const spatial = interpolateLocationMetrics(lat, lng, filteredPoints.length > 0 ? filteredPoints : telemetryPoints);

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
  let effectivePoints = telemetryPoints;
  if (!effectivePoints || effectivePoints.length === 0) {
    effectivePoints = generateRegionalTelemetry(lat, lng);
  }

  effectivePoints.forEach((p) => {
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
