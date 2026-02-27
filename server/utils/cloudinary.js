import { v2 as cloudinary } from 'cloudinary';

// Using process.env directly since these are specific to this file and optional for core boot
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
