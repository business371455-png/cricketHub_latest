import express from 'express';
import { getEarningsSummary } from '../controllers/earningsController.js';
import { protect } from '../middleware/auth.js';
import { ownerOnly } from '../middleware/ownerOnly.js';

const router = express.Router();

router.get('/summary', protect, ownerOnly, getEarningsSummary);

export default router;
