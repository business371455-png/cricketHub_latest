import express from 'express';
import {
    createTeam,
    getMyTeams,
    getTeamById,
    joinTeam,
    leaveTeam,
    disbandTeam,
} from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createTeam);

router.get('/my', protect, getMyTeams);

router.route('/:id')
    .get(protect, getTeamById)
    .delete(protect, disbandTeam);

router.put('/:id/join', protect, joinTeam);
router.put('/:id/leave', protect, leaveTeam);

export default router;
