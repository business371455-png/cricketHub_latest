import Joi from 'joi';

export const createGroundSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    images: Joi.array().items(Joi.string().uri()),
    amenities: Joi.array().items(Joi.string()),
    pricePerHour: Joi.number().min(0).required(),
    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
});

export const updateSlotSchema = Joi.object({
    slots: Joi.array().items(
        Joi.object({
            startTime: Joi.date().iso().required(),
            endTime: Joi.date().iso().min(Joi.ref('startTime')).required(),
            status: Joi.string().valid('Available', 'Reserved', 'Blocked').required(),
        })
    ).min(1).required(),
});
