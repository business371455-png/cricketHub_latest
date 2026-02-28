import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ENV, validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Validate environment variables
validateEnv();

// Connect to database
if (ENV.MONGODB_URI && ENV.MONGODB_URI.includes('mongodb')) {
    connectDB();
}

const app = express();

// ES-module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware Stack
// 1. Security Headers
app.use(helmet());

// 2. CORS
app.use(cors({
    origin: '*', // Adjust for production
}));

// 3. Logger
if (ENV.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// 5. Body Parser
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groundRoutes from './routes/groundRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import earningsRoutes from './routes/earningsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running normally' });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/grounds', groundRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/teams', teamRoutes);

// ---------- Serve Frontend Build (Production) ----------
const clientDistPath = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
    // Serve static assets (JS, CSS, images, etc.)
    app.use(express.static(clientDistPath));

    // SPA fallback — any non-API GET request serves index.html
    // so that React Router can handle client-side routing
    app.get(/^(?!\/api\/).*/, (req, res) => {
        res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });
} else {
    console.warn('⚠️  client/dist not found — frontend will not be served. Run "npm run build" in /client first.');
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = ENV.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
});
