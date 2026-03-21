import express from 'express';
import {
    createChallenge,
    getChallenges,
    getMyChallenges,
    getChallengeById,
    requestToJoin,
    selectOpponent,
    rejectRequest,
    cancelChallenge,
} from '../controllers/challengeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createChallenge)
    .get(getChallenges);

router.get('/my', protect, getMyChallenges);

router.route('/:id')
    .get(getChallengeById)
    .delete(protect, cancelChallenge);

router.put('/:id/request', protect, requestToJoin);
router.put('/:id/accept/:requestId', protect, selectOpponent);
router.put('/:id/reject/:requestId', protect, rejectRequest);

export default router;
