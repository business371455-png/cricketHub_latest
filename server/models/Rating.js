import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    toGround: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
