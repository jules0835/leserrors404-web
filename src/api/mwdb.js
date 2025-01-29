import mongoose from "mongoose"

export const mwdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    // eslint-disable-next-line no-console
    console.log("Successfully connected to the database")
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error connecting to database", error)
  }
}
