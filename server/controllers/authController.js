import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// In-memory store for OTPs (For production, use Redis)
const otpStore = new Map();

const generateToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400);
        throw new Error('Phone number is required');
    }

    // Generate a 6-digit OTP (for dev, we'll log it)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with an expiry (e.g., 5 minutes)
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

    console.log(`Mock SMS sent to ${phone}: Your OTP is ${otp}`);

    res.status(200).json({
        message: 'OTP sent successfully',
        mockOtp: otp // Send back for testing purposes
    });
});

// @desc    Verify OTP and login/register user
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        res.status(400);
        throw new Error('Phone and OTP are required');
    }

    const storedData = otpStore.get(phone);

    if (!storedData) {
        res.status(400);
        throw new Error('OTP not requested or expired');
    }

    if (Date.now() > storedData.expires) {
        otpStore.delete(phone);
        res.status(400);
        throw new Error('OTP expired');
    }

    if (storedData.otp !== otp) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    // OTP is valid, clear it
    otpStore.delete(phone);

    let user = await User.findOne({ phone });

    let isNewUser = false;
    if (!user) {
        user = await User.create({
            phone,
            name: 'New User', // Placeholder, needs update in profile setup
        });
        isNewUser = true;
    }

    res.status(200).json({
        _id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isOwner: user.isOwner,
        isNewUser,
        token: generateToken(user._id),
    });
});
