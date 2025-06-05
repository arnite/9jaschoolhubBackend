import { config } from 'dotenv';
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from "dotenv"
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import DBconnect from './config/DBconnect.js'
import compression from 'compression';
import morgan from 'morgan';
import globalErrorhandler from './controllers/errorController';

dotenv.config();

DBconnect()

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
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Enabling compression
app.use(compression());

//Enabling morgan
 if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
 } else if (process.env.NODE_ENV === 'production') {
   app.use(morgan('combined'));
 }

// Routers

// Invalid Routes

// Error handling
app.use(globalErrorhandler);

// Starting the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App running on ${PORT}..`);
});
