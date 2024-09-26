import mongoose from "mongoose"

export const mwdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.log("Error connecting to database", error)
  }
}
