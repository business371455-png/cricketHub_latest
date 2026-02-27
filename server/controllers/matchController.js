import Match from '../models/Match.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createMatchSchema } from '../validators/matchValidator.js';

// @desc    Create match
// @route   POST /api/matches
// @access  Private
export const createMatch = asyncHandler(async (req, res) => {
    const { error } = createMatchSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const match = new Match({
        creatorId: req.user._id,
        teamName: req.body.teamName,
        matchType: req.body.matchType,
        playersNeeded: req.body.playersNeeded,
        groundId: req.body.groundId || undefined,
        whatsappLink: req.body.whatsappLink || '',
        startTime: req.body.startTime,
        players: [req.user._id],
    });

    const createdMatch = await match.save();
    res.status(201).json(createdMatch);
});

// @desc    Get nearby matches
// @route   GET /api/matches/nearby?lng=&lat=&type=&date=
// @access  Public
export const getNearbyMatches = asyncHandler(async (req, res) => {
    const query = { status: 'Open' };
    if (req.query.type) {
        query.matchType = req.query.type;
    }
    if (req.query.date) {
        query.startTime = { $gte: new Date(req.query.date) };
    }

    const matches = await Match.find(query)
        .populate('creatorId', 'name disciplineRating profileImage')
        .populate('groundId', 'name location');

    res.json(matches);
});

// @desc    Get match details
// @route   GET /api/matches/:id
// @access  Public
export const getMatchById = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id)
        .populate('creatorId', 'name phone role disciplineRating profileImage')
        .populate('players', 'name role profileImage disciplineRating')
        .populate('groundId');

    if (match) {
        res.json(match);
    } else {
        res.status(404);
        throw new Error('Match not found');
    }
});

// @desc    Join a match
// @route   PUT /api/matches/:id/join
// @access  Private
export const joinMatch = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        res.status(404);
        throw new Error('Match not found');
    }

    if (match.status !== 'Open') {
        res.status(400);
        throw new Error('Match is no longer open');
    }

    if (match.players.includes(req.user._id)) {
        res.status(400);
        throw new Error('You have already joined this match');
    }

    match.players.push(req.user._id);

    if (match.players.length - 1 >= match.playersNeeded) {
        match.status = 'Confirmed';
    }

    const updatedMatch = await match.save();
    res.json(updatedMatch);
});

// @desc    Confirm match
// @route   PUT /api/matches/:id/confirm
// @access  Private
export const confirmMatch = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        res.status(404);
        throw new Error('Match not found');
    }

    if (match.creatorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the creator can confirm this match');
    }

    match.status = 'Confirmed';
    const updatedMatch = await match.save();
    res.json(updatedMatch);
});

// @desc    Cancel match
// @route   PUT /api/matches/:id/cancel
// @access  Private
export const cancelMatch = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        res.status(404);
        throw new Error('Match not found');
    }

    if (match.creatorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the creator can cancel this match');
    }

    match.status = 'Cancelled';
    const updatedMatch = await match.save();
    res.json(updatedMatch);
});
