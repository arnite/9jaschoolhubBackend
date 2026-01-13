import AppError from '../utils/appError.js';

export const API_KEY = (req, res, next) => {
  const clientKey = req.header('API_KEY');
  const API_KEY = process.env.API_KEY;

  if (!clientKey || clientKey !== API_KEY) {
    return next(new AppError('Invalid API Key', 401));
  }

  next();
};
