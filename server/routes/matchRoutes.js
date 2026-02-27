import express from 'express';
import {
    createMatch,
    getNearbyMatches,
    getMatchById,
    joinMatch,
    confirmMatch,
    cancelMatch,
} from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createMatch);

router.get('/nearby', getNearbyMatches);

router.route('/:id')
    .get(getMatchById);

router.put('/:id/join', protect, joinMatch);
router.put('/:id/confirm', protect, confirmMatch);
router.put('/:id/cancel', protect, cancelMatch);

export default router;
