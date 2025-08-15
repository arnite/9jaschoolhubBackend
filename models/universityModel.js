import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  }
});

const notableProgramSchema = new mongoose.Schema({
  Faculty: {
    type: String,
    required: true,
    trim: true
  },
  Courses: {
    type: [courseSchema],
    default: []
  }
});

const universitySchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true
  },
  university_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true,
    enum: ['Federal', 'State', 'Private']
  },
  website: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },
  phone_number: {
    type: String,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  notable_programs: {
    type: [notableProgramSchema],
    default: []
  },
  notes: {
    type: String,
    trim: true
  },
  school_fees_range: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.models.universityModel || mongoose.model("universityModel", universitySchema);