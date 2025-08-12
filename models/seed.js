import dotenv from "dotenv"
import mongoose from "mongoose"
import universityModel from "./universityModel.js"
import connectDB from "../config/DBconnect.js"
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImage } from "./lib/image-upload.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
connectDB()

// JSON file path
const jsonFilePath = path.join(__dirname, "universitySeed.json") // make sure it's a .json file

const importData = async () => {
  try {
    await universityModel.deleteMany()

    const rawData = fs.readFileSync(jsonFilePath, 'utf-8')
    const data = JSON.parse(rawData)

    const universityData = []

    for (const entry of data) {
      const imagePath = path.join(__dirname, entry.image)

      try {
        const uploadResult = await uploadImage(imagePath, 'university')
        universityData.push({
          ...entry,
          image: uploadResult,

        })
      } catch (uploadError) {
        console.error(`Failed to upload image for ${entry.university_name}:`, uploadError)
      }
    }

    await universityModel.insertMany(universityData)
    console.log(" Data Imported Successfully!")
    process.exit()
  } catch (error) {
    console.error(" Error importing data:", error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await universityModel.deleteMany()
    console.log(" Data Destroyed!")
    process.exit()
  } catch (error) {
    console.error(" Error destroying data:", error)
    process.exit(1)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
