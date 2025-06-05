import dotenv from "dotenv"
import mongoose from "mongoose"
import universitySeed from "./universitySeed.js"
import universityModel from "./universityModel.js"
import connectDB from "../config/DBconnect.js"

//import all env file
dotenv.config()
 
//establish connection to database
connectDB()

//import the JSON file of our UniversitySeed
const importData = async () => {
  try {

    await universityModel.deleteMany()
 
    const universityData = universitySeed.map(data => {
      return { ...data }
    })

    await universityModel.insertMany(universityData)
    console.log("Data Imported!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    
    await universityModel.deleteMany()
    

    console.log("Data Destroyed!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

if (process.argv[2] == "-d") {
  destroyData()
} else {
  importData()
}
