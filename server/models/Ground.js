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
    groundType: {
        type: String,
        enum: ['Open Ground', 'Net Practice', 'Box Cricket', 'Turf Ground', 'Stadium', 'Indoor'],
        default: 'Open Ground',
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
    address: {
        type: String,
        default: '',
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
            default: [0, 0],
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
