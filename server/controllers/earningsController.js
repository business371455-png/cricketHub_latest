import Booking from '../models/Booking.js';
import Ground from '../models/Ground.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Return daily, weekly, monthly revenue and total bookings for owner
// @route   GET /api/earnings/summary
// @access  Private/Owner
export const getEarningsSummary = asyncHandler(async (req, res) => {
    const grounds = await Ground.find({ ownerId: req.user._id });
    const groundIds = grounds.map(g => g._id);

    if (!groundIds.length) {
        return res.json({
            daily: 0,
            weekly: 0,
            monthly: 0,
            totalBookings: 0,
            recentBookings: []
        });
    }

    const bookings = await Booking.find({
        groundId: { $in: groundIds },
        paymentStatus: 'Paid'
    }).sort('-createdAt').populate('userId', 'name').populate('groundId', 'name');

    const now = new Date();
    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    bookings.forEach(booking => {
        const bDate = new Date(booking.createdAt);
        const diffTime = Math.abs(now - bDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) daily += booking.amount;
        if (diffDays <= 7) weekly += booking.amount;
        if (diffDays <= 30) monthly += booking.amount;
    });

    res.json({
        daily,
        weekly,
        monthly,
        totalBookings: bookings.length,
        recentBookings: bookings.slice(0, 5) // top 5 recent
    });
});
