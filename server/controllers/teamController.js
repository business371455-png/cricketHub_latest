import Team from '../models/Team.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTeamSchema } from '../validators/teamValidator.js';

// @desc    Create team
// @route   POST /api/teams
// @access  Private
export const createTeam = asyncHandler(async (req, res) => {
    const { error } = createTeamSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const team = new Team({
        name: req.body.name,
        matchType: req.body.matchType,
        captain: req.user._id,
        members: [req.user._id],
        maxSize: req.body.maxSize || 11,
        whatsappLink: req.body.whatsappLink || '',
    });

    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
});

// @desc    Get my teams
// @route   GET /api/teams/my
// @access  Private
export const getMyTeams = asyncHandler(async (req, res) => {
    const teams = await Team.find({
        members: req.user._id,
        status: 'Active',
    })
        .populate('captain', 'name profileImage')
        .populate('members', 'name role profileImage disciplineRating');

    res.json(teams);
});

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
export const getTeamById = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id)
        .populate('captain', 'name phone role profileImage disciplineRating')
        .populate('members', 'name role profileImage disciplineRating');

    if (!team) {
        res.status(404);
        throw new Error('Team not found');
    }

    res.json(team);
});

// @desc    Join team
// @route   PUT /api/teams/:id/join
// @access  Private
export const joinTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        res.status(404);
        throw new Error('Team not found');
    }

    if (team.status !== 'Active') {
        res.status(400);
        throw new Error('Team is no longer active');
    }

    if (team.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('You are already a member of this team');
    }

    if (team.members.length >= team.maxSize) {
        res.status(400);
        throw new Error('Team is full');
    }

    team.members.push(req.user._id);
    const updatedTeam = await team.save();

    const populatedTeam = await Team.findById(updatedTeam._id)
        .populate('captain', 'name profileImage')
        .populate('members', 'name role profileImage disciplineRating');

    res.json(populatedTeam);
});

// @desc    Leave team
// @route   PUT /api/teams/:id/leave
// @access  Private
export const leaveTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        res.status(404);
        throw new Error('Team not found');
    }

    if (!team.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('You are not a member of this team');
    }

    if (team.captain.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('Captain cannot leave the team. Disband it instead or transfer captaincy.');
    }

    team.members = team.members.filter(
        (member) => member.toString() !== req.user._id.toString()
    );
    const updatedTeam = await team.save();

    const populatedTeam = await Team.findById(updatedTeam._id)
        .populate('captain', 'name profileImage')
        .populate('members', 'name role profileImage disciplineRating');

    res.json(populatedTeam);
});

// @desc    Disband team (captain only)
// @route   DELETE /api/teams/:id
// @access  Private
export const disbandTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        res.status(404);
        throw new Error('Team not found');
    }

    if (team.captain.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the captain can disband the team');
    }

    team.status = 'Disbanded';
    await team.save();

    res.json({ message: 'Team disbanded successfully' });
});
