import Rating from '../models/Rating.js';
import User from '../models/User.js';
import Ground from '../models/Ground.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRatingSchema } from '../validators/ratingValidator.js';

// @desc    Submit rating (player->player or player->ground)
// @route   POST /api/ratings
// @access  Private
export const submitRating = asyncHandler(async (req, res) => {
    const { error } = createRatingSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { toUser, toGround, matchId, score, comment } = req.body;

    if (matchId) {
        const existingRating = await Rating.findOne({
            fromUser: req.user._id,
            matchId,
            ...(toUser ? { toUser } : { toGround })
        });

        if (existingRating) {
            res.status(400);
            throw new Error('You have already rated for this match');
        }
    }

    const rating = await Rating.create({
        fromUser: req.user._id,
        toUser,
        toGround,
        matchId,
        score,
        comment,
    });

    if (toUser) {
        const userRatings = await Rating.find({ toUser });
        const avgScore = userRatings.reduce((acc, r) => acc + r.score, 0) / userRatings.length;

        await User.findByIdAndUpdate(toUser, { disciplineRating: avgScore.toFixed(1) });
    }

    if (toGround) {
        const groundRatings = await Rating.find({ toGround });
        const avgScore = groundRatings.reduce((acc, r) => acc + r.score, 0) / groundRatings.length;

        await Ground.findByIdAndUpdate(toGround, {
            'ratings.average': avgScore.toFixed(1),
            'ratings.count': groundRatings.length
        });
    }

    res.status(201).json(rating);
});

// @desc    Get ratings for a ground
// @route   GET /api/ratings/ground/:groundId
// @access  Public
export const getGroundRatings = asyncHandler(async (req, res) => {
    const ratings = await Rating.find({ toGround: req.params.groundId })
        .populate('fromUser', 'name profileImage')
        .sort('-createdAt');

    res.json(ratings);
});
