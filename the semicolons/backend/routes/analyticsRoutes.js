import express from 'express';
import { getAnalyticsSummary, predictBatchRoute } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/analytics/summary', getAnalyticsSummary);
router.post('/ai/predict-batch', predictBatchRoute);

export default router;
