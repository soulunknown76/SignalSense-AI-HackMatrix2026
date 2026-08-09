import express from 'express';
import { getCarriers } from '../controllers/carrierController.js';

const router = express.Router();

router.get('/carriers', getCarriers);

export default router;
