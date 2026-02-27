import express from 'express';
import { getUserProfile, updateUserProfile, toggleOwnerRole } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/me')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/me/toggle-role', protect, toggleOwnerRole);

export default router;
