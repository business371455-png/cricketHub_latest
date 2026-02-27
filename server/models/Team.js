import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    matchType: {
        type: String,
        enum: ['Tennis', 'Leather', 'Box'],
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    maxSize: {
        type: Number,
        default: 11,
        min: 2,
        max: 22,
    },
    whatsappLink: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Active', 'Disbanded'],
        default: 'Active',
    },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
