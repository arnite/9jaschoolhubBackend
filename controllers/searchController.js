import universityModel from '../models/universityModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const searchByProgramme = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError('search query parameter is required', 400));
  }

  const feautures = new APIFeatures(
    universityModel.find({
      programmes: { $regex: new RegExp(search, 'i') }, // case-insensitive partial match
    }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute the query
  const doc = await feautures.query;

  if (!doc.length)
    return next(
      new AppError('No universities match your search criteria.', 404)
    );

  res.status(200).json({ count: doc.length, data: doc });
});

export const searchByUniversity = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError('search query parameter is required', 400));
  }

  // Create a regex pattern from the keyword (case-insensitive)
  const searchRegex = new RegExp(search, 'i');

  const feautures = new APIFeatures(
    universityModel.find({
      $or: [
        { universityName: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { type: { $regex: searchRegex } },
        { programmes: { $regex: searchRegex } },
      ],
    }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  // Execute the query
  const doc = await feautures.query;

  if (doc.length === 0)
    return next(
      new AppError('No universities match your search criteria.', 404)
    );

  res.status(200).json({ count: doc.length, data: doc });
});
