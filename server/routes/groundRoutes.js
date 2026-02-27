import express from 'express';
import {
    createGround,
    getNearbyGrounds,
    getMyGrounds,
    getGroundById,
    updateGround,
    updateGroundSlots,
} from '../controllers/groundController.js';
import { protect } from '../middleware/auth.js';
import { ownerOnly } from '../middleware/ownerOnly.js';

const router = express.Router();

router.route('/')
    .post(protect, ownerOnly, createGround);

router.get('/my', protect, ownerOnly, getMyGrounds);

router.get('/nearby', getNearbyGrounds);

router.route('/:id')
    .get(getGroundById)
    .put(protect, ownerOnly, updateGround);

router.put('/:id/slots', protect, ownerOnly, updateGroundSlots);

export default router;
