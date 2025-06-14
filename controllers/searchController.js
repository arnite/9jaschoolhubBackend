import universityModel from '../models/universityModel';
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
  const results = await University.find({
    $or: [
      { universityName: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { type: { $regex: searchRegex } },
      { programmes: { $regex: searchRegex } },
    ],
  });

  res.status(200).json({ count: results.length, data: results });
});
