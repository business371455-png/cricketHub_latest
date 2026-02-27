import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'cricket_hub' },
        (error, result) => {
            if (error) {
                console.error('Cloudinary Upload Error:', error);
                return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }
            res.json({
                message: 'Image uploaded successfully',
                url: result.secure_url,
            });
        }
    );

    uploadStream.end(req.file.buffer);
});

export default router;
