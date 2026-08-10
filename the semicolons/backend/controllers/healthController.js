import { getDBStatus } from '../config/db.js';

export const getHealthStatus = (req, res) => {
  const isDbConnected = getDBStatus();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SignalSense AI Backend API',
    database: isDbConnected ? 'connected' : 'disconnected (mock fallback mode)',
  });
};
