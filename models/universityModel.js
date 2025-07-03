import mongoose from "mongoose"
import validator from "validator"

const universitySchema = new mongoose.Schema(
      {
            image: String,

            university_name: {
                  type: String,
                  required: [true, "Please include the University name"],
                  unique: true,
            },
            location: {
                  type: String,
            },
            type: {
                  type: String,
            },
            website: {
                  type: String,
                  required: [true, "Please include the University website URL"],
            },
            email: {
                  type: String,
                  unique: true,
                  lowercase: true,
                  required: [true, "Please include the University email"],
                  validate: [validator.isEmail, "Please include a valid email."]
            },
            phone_number: {
                  type: String,
            },
            address: {
                  type: String,
            },
            notable_programs: [

                  {
                        type: String,
                  }

            ],

            admission_requirements: [
                  {
                        type: String,
                  }
            ],
            notes: {
                  type: String,
            },
            school_fees_range: {
                  type: String,
            }
      }
)

export default mongoose.models.universityModel || mongoose.model("universityModel", universitySchema);