const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Realistic mock dataset for immediate hackathon web preview
const MOCK_MEASUREMENTS = [
  // Kota / Rajasthan sample region points
  { id: 'm1', lat: 25.181, lng: 75.839, carrier: 'Jio', signal: -72, speed: 48, upload: 14, ping: 22, reliability: 98, time: '10 mins ago' },
  { id: 'm2', lat: 25.185, lng: 75.845, carrier: 'Airtel', signal: -68, speed: 56, upload: 18, ping: 19, reliability: 96, time: '15 mins ago' },
  { id: 'm3', lat: 25.178, lng: 75.832, carrier: 'Jio', signal: -79, speed: 38, upload: 10, ping: 28, reliability: 94, time: '20 mins ago' },
  { id: 'm4', lat: 25.172, lng: 75.828, carrier: 'Vi', signal: -88, speed: 22, upload: 6, ping: 45, reliability: 82, time: '25 mins ago' },
  { id: 'm5', lat: 25.192, lng: 75.852, carrier: 'BSNL', signal: -98, speed: 8, upload: 2, ping: 88, reliability: 65, time: '30 mins ago' },
  { id: 'm6', lat: 25.168, lng: 75.820, carrier: 'Vi', signal: -96, speed: 12, upload: 3, ping: 62, reliability: 70, time: '35 mins ago' },
  { id: 'm7', lat: 25.189, lng: 75.838, carrier: 'Airtel', signal: -74, speed: 52, upload: 16, ping: 21, reliability: 95, time: '40 mins ago' },
  { id: 'm8', lat: 25.161, lng: 75.815, carrier: 'Jio', signal: -104, speed: 4, upload: 1, ping: 120, reliability: 50, time: '50 mins ago' },
  { id: 'm9', lat: 25.195, lng: 75.860, carrier: 'Airtel', signal: -82, speed: 34, upload: 9, ping: 32, reliability: 88, time: '1 hour ago' },
  { id: 'm10', lat: 25.176, lng: 75.848, carrier: 'Jio', signal: -70, speed: 64, upload: 22, ping: 18, reliability: 99, time: '5 mins ago' }
];

const MOCK_CARRIERS = [
  {
    rank: 1,
    name: 'Jio',
    score: 91,
    signalStrength: -72,
    downloadSpeed: 48.5,
    uploadSpeed: 15.2,
    ping: 23,
    reliability: 96,
    trustScore: 94,
    coverage: '98%',
    badge: '🥇 Best Overall'
  },
  {
    rank: 2,
    name: 'Airtel',
    score: 84,
    signalStrength: -78,
    downloadSpeed: 42.0,
    uploadSpeed: 13.8,
    ping: 26,
    reliability: 92,
    trustScore: 90,
    coverage: '95%',
    badge: '🥈 Fastest Latency'
  },
  {
    rank: 3,
    name: 'Vi',
    score: 62,
    signalStrength: -92,
    downloadSpeed: 21.4,
    uploadSpeed: 5.6,
    ping: 48,
    reliability: 78,
    trustScore: 72,
    coverage: '82%',
    badge: '🥉 Moderate'
  },
  {
    rank: 4,
    name: 'BSNL',
    score: 55,
    signalStrength: -97,
    downloadSpeed: 11.2,
    uploadSpeed: 2.8,
    ping: 85,
    reliability: 64,
    trustScore: 60,
    coverage: '71%',
    badge: 'Rural Coverage'
  }
];

export async function fetchMeasurements() {
  try {
    const res = await fetch(`${API_BASE}/measurements`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API /measurements offline, using mock data.');
  }
  return MOCK_MEASUREMENTS;
}

export async function fetchCarriers() {
  try {
    const res = await fetch(`${API_BASE}/carriers`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API /carriers offline, using mock data.');
  }
  return MOCK_CARRIERS;
}

export async function fetchHeatmap() {
  try {
    const res = await fetch(`${API_BASE}/heatmap`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API /heatmap offline, generating dynamically.');
  }
  return MOCK_MEASUREMENTS.map(m => ({
    lat: m.lat,
    lng: m.lng,
    intensity: Math.max(0.1, (m.signal + 120) / 70)
  }));
}

export async function fetchPrediction(lat, lng) {
  try {
    const res = await fetch(`${API_BASE}/prediction?lat=${lat}&lng=${lng}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API /prediction offline, calculating local prediction.');
  }

  // Calculate proximity to dead zones or weak points
  const distFromCenter = Math.sqrt(Math.pow(lat - 25.181, 2) + Math.pow(lng - 75.839, 2));
  const isHighRisk = distFromCenter > 0.015 || (lat < 25.170 && lng < 75.825);
  
  const probDeadZone = isHighRisk ? Math.floor(75 + Math.random() * 20) : Math.floor(15 + Math.random() * 25);
  const riskLevel = probDeadZone > 65 ? 'HIGH' : probDeadZone > 35 ? 'MEDIUM' : 'LOW';
  const expectedSignal = isHighRisk ? -101 - Math.floor(Math.random() * 8) : -74 + Math.floor(Math.random() * 10);

  return {
    lat,
    lng,
    riskLevel,
    probabilityOfDeadZone: probDeadZone,
    expectedSignal,
    recommendation: probDeadZone > 65 ? 'Try Airtel in this location' : 'Jio provides optimal 5G coverage here'
  };
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      const data = await res.json();
      return { connected: true, data };
    }
  } catch (e) {
    // Backend offline
  }
  return { connected: false };
}

export async function fetchRecommendation(lat, lng) {
  try {
    const res = await fetch(`${API_BASE}/recommendation?lat=${lat}&lng=${lng}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend API /recommendation offline.');
  }
  return {
    bestCarrier: 'Airtel',
    backupCarrier: 'Jio',
    reasoning: 'Airtel operates a dedicated high-band cell tower 350m from target coordinate with 92% reliability.'
  };
}

