import Booking from '../models/Booking.js';
import Ground from '../models/Ground.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createBookingSchema, verifyPaymentSchema } from '../validators/bookingValidator.js';

// @desc    Create booking (lock slot, initiate payment mock)
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
    const { error } = createBookingSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { groundId, slotStart, slotEnd, amount } = req.body;

    const existingBooking = await Booking.findOne({
        groundId,
        $or: [
            { slotStart: { $lt: slotEnd }, slotEnd: { $gt: slotStart } }
        ],
        paymentStatus: { $in: ['Paid', 'Pending'] }
    });

    if (existingBooking) {
        res.status(400);
        throw new Error('Slot is no longer available');
    }

    const booking = await Booking.create({
        groundId,
        userId: req.user._id,
        slotStart,
        slotEnd,
        amount,
        paymentStatus: 'Pending',
    });

    res.status(201).json({
        booking,
        paymentToken: `mock_tok_${Date.now()}`
    });
});

// @desc    Verify payment callback
// @route   POST /api/bookings/verify-payment
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
    const { error } = verifyPaymentSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { bookingId, transactionId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to verify this booking');
    }

    booking.paymentStatus = 'Paid';
    booking.transactionId = transactionId;
    const updatedBooking = await booking.save();

    const ground = await Ground.findById(booking.groundId);
    if (ground) {
        ground.slots.push({
            startTime: booking.slotStart,
            endTime: booking.slotEnd,
            status: 'Reserved'
        });
        await ground.save();
    }

    res.json(updatedBooking);
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id })
        .populate('groundId', 'name address location images')
        .sort('-createdAt');
    res.json(bookings);
});

// @desc    Get bookings for a ground (owner only)
// @route   GET /api/bookings/ground/:groundId
// @access  Private/Owner
export const getGroundBookings = asyncHandler(async (req, res) => {
    const ground = await Ground.findById(req.params.groundId);

    if (!ground) {
        res.status(404);
        throw new Error('Ground not found');
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view bookings for this ground');
    }

    const bookings = await Booking.find({ groundId: req.params.groundId })
        .populate('userId', 'name phone profileImage disciplineRating')
        .sort('-slotStart');

    res.json(bookings);
});
