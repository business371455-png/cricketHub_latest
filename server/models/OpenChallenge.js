import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
});

const openChallengeSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    teamName: {
        type: String,
        required: true,
        trim: true,
    },
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    slotStart: {
        type: Date,
        required: true,
    },
    slotEnd: {
        type: Date,
        required: true,
    },
    matchType: {
        type: String,
        enum: ['Tennis', 'Leather', 'Box'],
        required: true,
    },
    overs: {
        type: Number,
        required: true,
        min: 1,
        max: 50,
    },
    playersRequired: {
        type: Number,
        required: true,
        min: 1,
        max: 22,
    },
    notes: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Open', 'Pending', 'Accepted', 'Rejected', 'Expired', 'ConvertedToMatch', 'Cancelled'],
        default: 'Open',
    },
    requests: [requestSchema],
    acceptedRequestId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

// Compound index for efficient expiry cron queries
openChallengeSchema.index({ status: 1, expiresAt: 1 });

const OpenChallenge = mongoose.model('OpenChallenge', openChallengeSchema);
export default OpenChallenge;
