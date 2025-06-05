import mongoose from "mongoose"



const universitySchema = new mongoose.Schema(
  {
    image: {
            type: String,
            required: false,
           }, 

    universityName: {
                    type: String,
                    required: true,
                    unique: true,
                    },
    location: {
              type: String,
              required: true,
              },
    type: {
          type: String,
          required: true,
          },
    website: {
              type: String,
              required: true,
             },
    email: {
            type: String,
            required: false,
           },
    phone: {
            type: Number,
            required: false,
           },
    address: {
              type: String,
              required: false,
      
             },
    programmes: [
                   
                   {
                    type: String,
                    required: false
                    }           
                 
               ],
                
    requirements: [
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