// lib/multer.js
import multer from 'multer';
import path from 'path';

// Store file temporarily in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    return cb(new Error('Only images are allowed'));
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
