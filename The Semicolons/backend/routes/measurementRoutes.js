import express from 'express';
import {
  getMeasurements,
  createMeasurement,
  getHeatmap,
} from '../controllers/measurementController.js';

const router = express.Router();

router.get('/measurements', getMeasurements);
router.post('/measurements', createMeasurement);
router.get('/heatmap', getHeatmap);

export default router;
