import express from 'express';
import {
    createMatch,
    getNearbyMatches,
    getMatchById,
    getMyMatches,
    joinMatch,
    leaveMatch,
    confirmMatch,
    cancelMatch,
} from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createMatch);

router.get('/nearby', getNearbyMatches);
router.get('/my', protect, getMyMatches);

router.route('/:id')
    .get(getMatchById);

router.put('/:id/join', protect, joinMatch);
router.put('/:id/leave', protect, leaveMatch);
router.put('/:id/confirm', protect, confirmMatch);
router.put('/:id/cancel', protect, cancelMatch);

export default router;

