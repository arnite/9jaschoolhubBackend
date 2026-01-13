import catchAsync from '../utils/catchAsync.js';
import universityModel from '../models/universityModel.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import mongoose from 'mongoose';

// Create a university
export const createUniversity = catchAsync(async (req, res, next) => {
  const existingUniversity = await universityModel.findOne({
    $or: [
      { university_name: req.body.university_name },
      { email: req.body.email },
      { website: req.body.website }
    ]
  });

  if (existingUniversity) {
    return next(new AppError("University already exists", 400))
  }

  const newUniversity = await universityModel.create(req.body)
  res.status(201).json({
    status: "success",
    data: { university: newUniversity}
  })
})

// Get all universities
export const getAllUniversities = catchAsync(async (req, res, next) => {
  const feautures = new APIFeatures(universityModel.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const doc = await feautures.query;

  if (!doc || doc.length <= 0) {
    return next(new AppError('No university found', 404));
  }

  return res.status(200).json({
    status: 'success',
    count: doc.length,
    data: { doc },
  });
});

// Get university by ID
export const getUniversityById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid university ID format", 400))
  }

  const university = await universityModel.findById(id)

  if (!university) {
    return next(new AppError("University not found", 404))
  }

  res.status(200).json({
    status: "success",
    data: { university }
  });
});

// Update university with ID
export const updateUniversity = catchAsync(async (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid university id", 400))
  }

  if (req.body.university_name || req.body.email || req.body.website) {
    const existingUniversity = await universityModel.findOne({
      _id: { $ne: id },
      $or: [
        { university_name: req.body.university_name },
        { email: req.body.email },
        { website: req.body.website }
      ]
    });

    if (existingUniversity) {
      return next(new AppError("University with these details exists", 400))
    }
  }

  const updatedUniversity = await universityModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true}
  );

   if (!updatedUniversity) {
    return next(new AppError("University not found", 404)) // 404, not 400
   }

   res.status(200).json({
    status: "success",
    data: { updatedUniversity } // Fixed typo
   })
})

// Delete university with ID
export const deleteUniversity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid university ID", 400))
  }

  const deletedUniversity = await universityModel.findByIdAndDelete(id);

  if (!deletedUniversity) {
    return next(new AppError('University not found', 404));
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});