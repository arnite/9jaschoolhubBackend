const dotenv = require('dotenv');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const globalErrorhandler = require('./controllers/errorController');

// Configuring environmental variable
dotenv.config({ path: './.env' });

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
app.use(express.json({ limit: '10kb' }));

// Data sanitiazation
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Enabling compression
app.use(compression());

// Enabling morgan
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
