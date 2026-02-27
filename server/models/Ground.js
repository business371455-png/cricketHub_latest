import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Blocked'],
        default: 'Available',
    }
});

const groundSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
    }],
    amenities: [{
        type: String,
    }],
    pricePerHour: {
        type: Number,
        required: true,
    },
    slots: [slotSchema],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    }
}, { timestamps: true });

groundSchema.index({ location: '2dsphere' });

const Ground = mongoose.model('Ground', groundSchema);
export default Ground;
