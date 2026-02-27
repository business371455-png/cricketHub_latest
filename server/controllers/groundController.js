import Ground from '../models/Ground.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createGroundSchema, updateSlotSchema } from '../validators/groundValidator.js';

// @desc    Create ground
// @route   POST /api/grounds
// @access  Private/Owner
export const createGround = asyncHandler(async (req, res) => {
    const { error } = createGroundSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const ground = new Ground({
        ownerId: req.user._id,
        name: req.body.name,
        images: req.body.images || [],
        amenities: req.body.amenities || [],
        pricePerHour: req.body.pricePerHour,
        location: req.body.location,
        slots: [],
    });

    const createdGround = await ground.save();
    res.status(201).json(createdGround);
});

// @desc    Get grounds owned by current user
// @route   GET /api/grounds/my
// @access  Private/Owner
export const getMyGrounds = asyncHandler(async (req, res) => {
    const grounds = await Ground.find({ ownerId: req.user._id });
    res.json(grounds);
});

// @desc    Get nearby grounds
// @route   GET /api/grounds/nearby?lng=&lat=&radius=
// @access  Public
export const getNearbyGrounds = asyncHandler(async (req, res) => {
    const { lng, lat, radius } = req.query;

    if (!lng || !lat || !radius) {
        // Fallback for MVP: return all grounds if no location provided
        const allGrounds = await Ground.find({});
        return res.json(allGrounds);
    }

    const radiusInRadians = radius / 6378.1; // Earth radius in km

    const grounds = await Ground.find({
        location: {
            $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians] },
        },
    });

    res.json(grounds);
});

// @desc    Get single ground details
// @route   GET /api/grounds/:id
// @access  Public
export const getGroundById = asyncHandler(async (req, res) => {
    const ground = await Ground.findById(req.params.id).populate('ownerId', 'name phone');

    if (ground) {
        res.json(ground);
    } else {
        res.status(404);
        throw new Error('Ground not found');
    }
});

// @desc    Update ground
// @route   PUT /api/grounds/:id
// @access  Private/Owner
export const updateGround = asyncHandler(async (req, res) => {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
        res.status(404);
        throw new Error('Ground not found');
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this ground');
    }

    ground.name = req.body.name || ground.name;
    ground.images = req.body.images || ground.images;
    ground.amenities = req.body.amenities || ground.amenities;
    ground.pricePerHour = req.body.pricePerHour || ground.pricePerHour;
    if (req.body.location) {
        ground.location = req.body.location;
    }

    const updatedGround = await ground.save();
    res.json(updatedGround);
});

// @desc    Update slot availability
// @route   PUT /api/grounds/:id/slots
// @access  Private/Owner
export const updateGroundSlots = asyncHandler(async (req, res) => {
    const { error } = updateSlotSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const ground = await Ground.findById(req.params.id);

    if (!ground) {
        res.status(404);
        throw new Error('Ground not found');
    }

    if (ground.ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this ground slots');
    }

    ground.slots = req.body.slots;

    const updatedGround = await ground.save();
    res.json(updatedGround);
});
