import catchAsync from '../utils/catchAsync.js';
import universityModel from '../models/universityModel.js';
import AppError from '../utils/appError.js';
import { isValidId } from '../utils/validId.js';
import { validateUniversity } from '../validators/universityValidator.js';

// Create a university
export const createUniversity = catchAsync(async (req, res, next) => {
  // Validate error from req.body
  const validateError = validateUniversity(req.body);
  if (validateError) {
    return next(new AppError(validateError.message, validateError.statusCode));
  }

  // Find university by the website
  const universityExist = await universityModel.findOne({
    website: req.body.website,
  });

  // Check if university exists
  if (universityExist) {
    return next(new AppError('University already exists...', 400));
  }

  // Create new university
  const newUniversity = await universityModel.create(req.body);

  return res.status(201).json({
    status: 'success',
    data: { newUniversity },
  });
});

// Get all universities
export const getAllUniversities = catchAsync(async (req, res, next) => {
  const universities = await universityModel.find();

  if (!universities || universities.length <= 0) {
    return next(new AppError('No university found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { universities },
  });
});

// Get university by ID
export const getUniversityById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Invalid university Id', 400));
  }

  const university = await universityModel.findById(id);

  if (!university) {
    return next(new AppError('University does not exist...', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { university },
  });
});

// Update university with ID
export const updateUniversity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Invalid university Id', 400));
  }

  const updatedUniversity = await universityModel.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedUniversity) {
    return next(new AppError('University do not exist....', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { updatedUniversity },
  });
});

// Delete university with ID
export const deleteUniversity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return next(new AppError('Invalid university Id', 400));
  }

  const deletedUniversity = await universityModel.findByIdAndDelete(id);

  if (!deletedUniversity) {
    return next(new AppError('University do not exist....', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});
