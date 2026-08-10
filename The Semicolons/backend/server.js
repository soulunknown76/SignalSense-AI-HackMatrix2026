import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedData } from './config/seedData.js';
import healthRoutes from './routes/healthRoutes.js';
import measurementRoutes from './routes/measurementRoutes.js';
import carrierRoutes from './routes/carrierRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : [corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api', measurementRoutes);
app.use('/api', carrierRoutes);
app.use('/api', predictionRoutes);
app.use('/api', authRoutes);
app.use('/api', analyticsRoutes);



// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SignalSense AI Backend API is operational',
    endpoints: {
      health: '/api/health',
      measurements: '/api/measurements',
      carriers: '/api/carriers',
      heatmap: '/api/heatmap',
      prediction: '/api/prediction?lat=25.181&lng=75.839',
      recommendation: '/api/recommendation?lat=25.181&lng=75.839',
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP server immediately so APIs are instantly accessible
app.listen(PORT, () => {
  console.log(`🚀 SignalSense AI Backend Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);

  // Attempt database connection in background
  connectDB().then(isConnected => {
    if (isConnected) {
      seedData();
    }
  });
});

