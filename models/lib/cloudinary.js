
// cloudinary.js
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete all images
const deleteAllImages = async () => {
  try {
    const result = await cloudinary.api.delete_all_resources({ resource_type: 'image' });
    console.log('Deleted:', result);
  } catch (err) {
    console.error('Error:', err);
  }
};

//deleteAllImages();

export default cloudinary;

