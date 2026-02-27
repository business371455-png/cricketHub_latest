import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
        default: 'All-rounder',
    },
    profileImage: {
        type: String,
        default: '',
    },
    disciplineRating: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5,
    },
    isOwner: {
        type: Boolean,
        default: false,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
export default User;
