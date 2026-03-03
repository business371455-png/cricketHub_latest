import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);

            // Try MongoDB first, fall back to decoded token if DB unavailable
            try {
                const dbUser = await User.findById(decoded.id).select('-createdAt -updatedAt');
                if (dbUser) {
                    req.user = dbUser;
                } else {
                    req.user = { _id: decoded.id };
                }
            } catch (dbError) {
                // MongoDB unavailable — use token payload
                req.user = { _id: decoded.id };
            }

            return next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});
