import universityModel from "../models/universityModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

// 🔹 Search by Programme (Faculty, Courses, Requirements)
export const searchByProgramme = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError("search query parameter is required", 400));
  }

  const searchRegex = new RegExp(search, "i");

  const features = new APIFeatures(
    universityModel.find({
      $or: [
        { "notable_programs.Faculty": { $regex: searchRegex } },
        { "notable_programs.Courses.course": { $regex: searchRegex } },
        { "notable_programs.Courses.requirements": { $regex: searchRegex } }
      ]
    }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const doc = await features.query;

  if (!doc.length) {
    return next(
      new AppError("No universities match your search criteria.", 404)
    );
  }

  res.status(200).json({ count: doc.length, data: doc });
});

// 🔹 Search by University (University fields + Programme fields)
export const searchByUniversity = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError("search query parameter is required", 400));
  }

  const searchRegex = new RegExp(search, "i");

  const features = new APIFeatures(
    universityModel.find({
      $or: [
        // top-level fields
        { university_name: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { type: { $regex: searchRegex } },

        // programme fields
        { "notable_programs.Faculty": { $regex: searchRegex } },
        { "notable_programs.Courses.course": { $regex: searchRegex } },
        { "notable_programs.Courses.requirements": { $regex: searchRegex } }
      ]
    }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const doc = await features.query;

  if (!doc.length) {
    return next(
      new AppError("No universities match your search criteria.", 404)
    );
  }

  res.status(200).json({ count: doc.length, data: doc });
});