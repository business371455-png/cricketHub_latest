import Joi from 'joi';

export const createChallengeSchema = Joi.object({
    teamName: Joi.string().min(2).max(50).required(),
    teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    groundId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    // bookingId is now optional — challenges can be created without a pre-booking
    bookingId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    // slotStart & slotEnd required when no bookingId is provided
    slotStart: Joi.date().iso(),
    slotEnd: Joi.date().iso(),
    matchType: Joi.string().valid('Tennis', 'Leather', 'Box').required(),
    overs: Joi.number().integer().min(1).max(50).required(),
    playersRequired: Joi.number().integer().min(1).max(22).required(),
    notes: Joi.string().max(500).allow(''),
}).custom((value, helpers) => {
    // If no bookingId, require slotStart and slotEnd
    if (!value.bookingId && (!value.slotStart || !value.slotEnd)) {
        return helpers.error('any.custom', {
            message: 'slotStart and slotEnd are required when no bookingId is provided',
        });
    }
    return value;
});

export const requestToJoinSchema = Joi.object({
    teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
    teamName: Joi.string().min(2).max(50).required(),
    message: Joi.string().max(300).allow(''),
});
