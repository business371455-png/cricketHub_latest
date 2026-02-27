import Joi from 'joi';

export const createBookingSchema = Joi.object({
    groundId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    slotStart: Joi.date().iso().required(),
    slotEnd: Joi.date().iso().min(Joi.ref('slotStart')).required(),
    amount: Joi.number().min(0).required(),
});

export const verifyPaymentSchema = Joi.object({
    bookingId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    transactionId: Joi.string().required(),
});
