import OpenChallenge from '../models/OpenChallenge.js';
import Booking from '../models/Booking.js';
import Match from '../models/Match.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createChallengeSchema, requestToJoinSchema } from '../validators/challengeValidator.js';

// @desc    Create an open challenge
// @route   POST /api/challenges
// @access  Private
export const createChallenge = asyncHandler(async (req, res) => {
    const { error } = createChallengeSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    // Validate that the booking belongs to the creator
    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You can only create challenges for your own bookings');
    }

    // Check no existing open challenge for the same booking
    const existingChallenge = await OpenChallenge.findOne({
        bookingId: req.body.bookingId,
        status: { $nin: ['Expired', 'Cancelled', 'Rejected'] },
    });
    if (existingChallenge) {
        res.status(400);
        throw new Error('A challenge already exists for this booking');
    }

    // Auto-set expiresAt to 2 hours before the slot start time
    const expiresAt = new Date(booking.slotStart.getTime() - 2 * 60 * 60 * 1000);

    const challenge = new OpenChallenge({
        creatorId: req.user._id,
        teamId: req.body.teamId || undefined,
        teamName: req.body.teamName,
        groundId: req.body.groundId,
        bookingId: req.body.bookingId,
        slotStart: booking.slotStart,
        slotEnd: booking.slotEnd,
        matchType: req.body.matchType,
        overs: req.body.overs,
        playersRequired: req.body.playersRequired,
        notes: req.body.notes || '',
        expiresAt,
    });

    const created = await challenge.save();
    res.status(201).json(created);
});

// @desc    Get open challenges (browse / discovery)
// @route   GET /api/challenges?matchType=&groundId=&date=
// @access  Public
export const getChallenges = asyncHandler(async (req, res) => {
    const query = { status: { $in: ['Open', 'Pending'] } };

    if (req.query.matchType) {
        query.matchType = req.query.matchType;
    }
    if (req.query.groundId) {
        query.groundId = req.query.groundId;
    }
    if (req.query.date) {
        const start = new Date(req.query.date);
        const end = new Date(req.query.date);
        end.setDate(end.getDate() + 1);
        query.slotStart = { $gte: start, $lt: end };
    }

    const challenges = await OpenChallenge.find(query)
        .populate('creatorId', 'name profileImage disciplineRating')
        .populate('groundId', 'name location address images')
        .sort('-createdAt');

    res.json(challenges);
});

// @desc    Get challenges created by current user
// @route   GET /api/challenges/my
// @access  Private
export const getMyChallenges = asyncHandler(async (req, res) => {
    const challenges = await OpenChallenge.find({ creatorId: req.user._id })
        .populate('groundId', 'name location address')
        .sort('-createdAt');

    res.json(challenges);
});

// @desc    Get challenge by ID (full detail)
// @route   GET /api/challenges/:id
// @access  Public
export const getChallengeById = asyncHandler(async (req, res) => {
    const challenge = await OpenChallenge.findById(req.params.id)
        .populate('creatorId', 'name phone profileImage disciplineRating')
        .populate('groundId', 'name location address images pricePerHour')
        .populate('bookingId')
        .populate('requests.captainId', 'name profileImage disciplineRating')
        .populate('matchId');

    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    res.json(challenge);
});

// @desc    Request to join a challenge
// @route   PUT /api/challenges/:id/request
// @access  Private
export const requestToJoin = asyncHandler(async (req, res) => {
    const { error } = requestToJoinSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const challenge = await OpenChallenge.findById(req.params.id);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    if (!['Open', 'Pending'].includes(challenge.status)) {
        res.status(400);
        throw new Error('This challenge is no longer accepting requests');
    }

    // Prevent creator from requesting their own challenge
    if (challenge.creatorId.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot request to join your own challenge');
    }

    // Prevent duplicate requests from the same user
    const alreadyRequested = challenge.requests.find(
        r => r.captainId.toString() === req.user._id.toString() && r.status === 'Pending'
    );
    if (alreadyRequested) {
        res.status(400);
        throw new Error('You have already requested to join this challenge');
    }

    challenge.requests.push({
        teamId: req.body.teamId || undefined,
        captainId: req.user._id,
        teamName: req.body.teamName,
        message: req.body.message || '',
    });

    // Move to Pending if this is the first request
    if (challenge.status === 'Open') {
        challenge.status = 'Pending';
    }

    const updated = await challenge.save();
    res.json(updated);
});

// @desc    Accept a request (select opponent) — converts challenge to match
// @route   PUT /api/challenges/:id/accept/:requestId
// @access  Private (creator only)
export const selectOpponent = asyncHandler(async (req, res) => {
    const challenge = await OpenChallenge.findById(req.params.id);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    if (challenge.creatorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the challenge creator can accept requests');
    }

    if (!['Open', 'Pending'].includes(challenge.status)) {
        res.status(400);
        throw new Error('This challenge can no longer accept opponents');
    }

    const targetRequest = challenge.requests.id(req.params.requestId);
    if (!targetRequest) {
        res.status(404);
        throw new Error('Request not found');
    }

    // 1. Mark chosen request as Accepted
    targetRequest.status = 'Accepted';

    // 2. Mark all other pending requests as Rejected
    challenge.requests.forEach(r => {
        if (r._id.toString() !== req.params.requestId && r.status === 'Pending') {
            r.status = 'Rejected';
        }
    });

    // 3. Create a new Match document
    const match = new Match({
        creatorId: challenge.creatorId,
        teamName: challenge.teamName,
        matchType: challenge.matchType,
        playersNeeded: challenge.playersRequired,
        overs: challenge.overs,
        groundId: challenge.groundId,
        startTime: challenge.slotStart,
        status: 'Confirmed',
        players: [challenge.creatorId, targetRequest.captainId],
    });
    const createdMatch = await match.save();

    // 4. Update challenge state
    challenge.acceptedRequestId = targetRequest._id;
    challenge.matchId = createdMatch._id;
    challenge.status = 'ConvertedToMatch';

    await challenge.save();

    res.json({
        challenge,
        match: createdMatch,
    });
});

// @desc    Reject a specific request
// @route   PUT /api/challenges/:id/reject/:requestId
// @access  Private (creator only)
export const rejectRequest = asyncHandler(async (req, res) => {
    const challenge = await OpenChallenge.findById(req.params.id);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    if (challenge.creatorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the challenge creator can reject requests');
    }

    const targetRequest = challenge.requests.id(req.params.requestId);
    if (!targetRequest) {
        res.status(404);
        throw new Error('Request not found');
    }

    targetRequest.status = 'Rejected';

    // If no pending requests remain, revert to Open
    const hasPending = challenge.requests.some(r => r.status === 'Pending');
    if (!hasPending) {
        challenge.status = 'Open';
    }

    const updated = await challenge.save();
    res.json(updated);
});

// @desc    Cancel a challenge
// @route   DELETE /api/challenges/:id
// @access  Private (creator only)
export const cancelChallenge = asyncHandler(async (req, res) => {
    const challenge = await OpenChallenge.findById(req.params.id);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    if (challenge.creatorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the challenge creator can cancel');
    }

    if (challenge.status === 'ConvertedToMatch') {
        res.status(400);
        throw new Error('Cannot cancel a challenge that has already been converted to a match');
    }

    challenge.status = 'Cancelled';
    const updated = await challenge.save();
    res.json(updated);
});
