import express from 'express';
import { submitRating, getGroundRatings } from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, submitRating);
router.get('/ground/:groundId', getGroundRatings);

export default router;
