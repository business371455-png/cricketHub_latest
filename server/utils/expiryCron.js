import cron from 'node-cron';
import OpenChallenge from '../models/OpenChallenge.js';

/**
 * Expiry cron – runs every 30 minutes.
 * Marks open/pending challenges as 'Expired' if their expiresAt has passed.
 */
export const startExpiryCron = () => {
    // Run every 30 minutes: "*/30 * * * *"
    cron.schedule('*/30 * * * *', async () => {
        try {
            const now = new Date();
            const result = await OpenChallenge.updateMany(
                {
                    status: { $in: ['Open', 'Pending'] },
                    expiresAt: { $lte: now },
                },
                { $set: { status: 'Expired' } }
            );

            if (result.modifiedCount > 0) {
                console.log(`⏰ Expired ${result.modifiedCount} challenge(s)`);
            }
        } catch (err) {
            console.error('❌ Challenge expiry cron error:', err.message);
        }
    });

    console.log('✅ Challenge expiry cron started (every 30 min)');
};
