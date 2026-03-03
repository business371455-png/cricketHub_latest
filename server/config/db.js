import mongoose from 'mongoose';
import { ENV } from './env.js';

// Prevent mongoose from crashing the process on connection errors
mongoose.connection.on('error', (err) => {
    console.error(`⚠️ MongoDB connection error: ${err.message}`);
});

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`⚠️ MongoDB connection failed: ${error.message}`);
        console.error('Server will continue running but database features may not work.');
    }
};
