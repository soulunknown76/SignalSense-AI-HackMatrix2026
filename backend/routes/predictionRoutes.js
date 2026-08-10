import express from 'express';
import { getPrediction, getRecommendation } from '../controllers/predictionController.js';

const router = express.Router();

router.get('/prediction', getPrediction);
router.get('/recommendation', getRecommendation);

export default router;
