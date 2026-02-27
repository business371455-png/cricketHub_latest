import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    matchType: {
        type: String,
        enum: ['Tennis', 'Leather', 'Box'],
        required: true,
    },
    playersNeeded: {
        type: Number,
        required: true,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['Open', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Open',
    },
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
    },
    whatsappLink: {
        type: String,
    },
    startTime: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
export default Match;
