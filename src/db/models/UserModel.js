import mongoose from "mongoose"
import { userSchema } from "@/db/schemas/userSchema"

export const UserModel =
  mongoose.models?.User || mongoose.model("User", userSchema)
