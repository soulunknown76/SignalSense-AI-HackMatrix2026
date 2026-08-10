import Measurement from '../models/Measurement.js';
import Carrier from '../models/Carrier.js';

export const INITIAL_MEASUREMENTS = [
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

export const INITIAL_CARRIERS = [
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

export const seedData = async () => {
  try {
    const measurementCount = await Measurement.countDocuments();
    if (measurementCount === 0) {
      await Measurement.insertMany(INITIAL_MEASUREMENTS);
      console.log('[Seed] Seeded initial measurement records into MongoDB');
    }

    const carrierCount = await Carrier.countDocuments();
    if (carrierCount === 0) {
      await Carrier.insertMany(INITIAL_CARRIERS);
      console.log('[Seed] Seeded initial carrier rankings into MongoDB');
    }
  } catch (error) {
    console.warn(`[Seed] Automatic seeding skipped: ${error.message}`);
  }
};
