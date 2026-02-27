import express from 'express';
import {
    createBooking,
    verifyPayment,
    getMyBookings,
    getGroundBookings,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { ownerOnly } from '../middleware/ownerOnly.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my', protect, getMyBookings);
router.get('/ground/:groundId', protect, ownerOnly, getGroundBookings);

export default router;
