import universityModel from '../models/universityModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const searchByProgramme = catchAsync(async (req, res, next) => {
  const { programme } = req.query;

  if (!programme) {
    return next(new AppError('Programme query parameter is required', 400));
  }

  const results = await universityModel.find({
    programmes: { $regex: new RegExp(programme, 'i') }, // case-insensitive partial match
  });

  if (!results.length)
    return next(
      new AppError('No universities match your search criteria.', 404)
    );

  res.status(200).json({ count: results.length, data: results });
});

export const searchByUniversity = catchAsync(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return next(new AppError('Keyword query parameter is required', 400));
  }

  // Create a regex pattern from the keyword (case-insensitive)
  const searchRegex = new RegExp(keyword, 'i');

  // Search across multiple fields
  const results = await universityModel.find({
    $or: [
      { universityName: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { type: { $regex: searchRegex } },
      { programmes: { $regex: searchRegex } },
    ],
  });

  if (results.length === 0)
    return next(
      new AppError('No universities match your search criteria.', 404)
    );

  res.status(200).json({ count: results.length, data: results });
});
