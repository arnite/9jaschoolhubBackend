import { config } from 'dotenv';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import DBconnect from './config/DBconnect.js';
import errorController from './controllers/errorController.js';
import universityRouter from './routes/universityRoute.js';
import searchProgrammeRouter from './routes/searchProgramme.js';
import searchUniversityRouter from './routes/searchUniversity.js';
import cloudinary from './models/lib/cloudinary.js';
import { upload } from './models/lib/multer.js';
import streamifier from 'streamifier';
import { CloudinaryStorage } from 'multer-storage-cloudinary'

dotenv.config();

// DBconnect();

if (process.env.NODE_ENV !== 'test') {
  DBconnect();
}

const app = express();

// Configuring environmental variable
config({ path: './.env' });

//Setting up security middleware
app.use(helmet());

//Enabling CORS (Cross-origin-request)
app.use(cors());

// Enabling rate-limting
app.use(
  rateLimit({
    max: 100,
    windowMs: 120 * 60 * 1000,
    message: 'Too many request, please try again later',
  })
);

// Enabling body parser
app.use(json({ limit: '10kb' }));

// Data sanitiazation
// app.use(xss());
// app.use(hpp());

// Enabling compression
// app.use(compression());

//Enabling morgan
//  if (process.env.NODE_ENV === 'development') {
//    app.use(morgan('dev'));
//  } else if (process.env.NODE_ENV === 'production') {
//    app.use(morgan('combined'));
//  }

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});



// Endpoint to upload file
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.json({
      message: 'Upload successful',
      fileUrl: req.file.path,
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

//Test route
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3;url=https://documenter.getpostman.com/view/37611500/2sB2x6mXd8">
      </head>
      <body style="margin-top: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: blue; font-size: 2em;"><strong>API is Running Successfully</strong></h1>
        <p style="font-size: 1.2em;">Redirecting to API documentation in 3 seconds...</p>
        <p>If not redirected, click 
          <a href="https://documenter.getpostman.com/view/37611500/2sB2x6mXd8" style="color: green; font-weight: bold;">
            here
          </a>.
        </p>
      </body>
    </html>
  `);
});

// Routers
app.use('/universityRoute', universityRouter);
app.use('/searchProgramme', searchProgrammeRouter);
app.use('/searchUniversity', searchUniversityRouter);

// Global error handler (must be last)
// app.use(globalErrorhandler)
//app.use(errorController)

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});


// // Starting the server
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`App running on ${PORT}..`);
// });

// Starting the server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App running on ${PORT}..`);
  });
}

export default app