import mongoose from "mongoose"



const universitySchema = new mongoose.Schema(
  {
    image: String,

    university_name: {
                    type: String,
                    required: true,
                    unique: true,
                    },
    school_fees: {
              type: String,
              required: false,
              },                
    location: {
              type: String,
              required: false,
              },
    type: {
          type: String,
          required: false,
          },
    website: {
              type: String,
              required: true,
             },
    email: {
            type: String,
            required: false,
           },
    phone_number: {
            type: String,
            required: false,
           },
    address: {
              type: String,
              required: false,
      
             },
    notable_programs: [
                   
                   {
                    type: String,
                    required: false
                    }           
                 
               ],
                
   admission_requirements: [
                    {
                    type: String,
                    required: false
                    }
                  ],
    notes: {
            type: String,
            required: false,
           }
        }
            )

export default mongoose.models.universityModel || mongoose.model("universityModel", universitySchema);