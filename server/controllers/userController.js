import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { updateUserSchema } from '../validators/userValidator.js';

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const { error } = updateUserSchema.validate(req.body);

    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.role = req.body.role || user.role;
        user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;
        if (req.body.isOwner !== undefined) {
            user.isOwner = req.body.isOwner;
        }
        if (req.body.location) {
            user.location = req.body.location;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Toggle isOwner flag
// @route   PUT /api/users/me/toggle-role
// @access  Private
export const toggleOwnerRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.isOwner = !user.isOwner;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            isOwner: updatedUser.isOwner,
            message: `Role switched to ${updatedUser.isOwner ? 'Owner' : 'Player'}`
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
