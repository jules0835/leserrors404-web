import mongoose from "mongoose"
import { UserModel } from "@/db/models/indexModels"

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

export const findUserById = async (userId) =>
  await UserModel.findById(userId).exec()

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI)
  }
}
