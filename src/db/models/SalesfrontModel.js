import mongoose from "mongoose"
import { salesfrontSchema } from "@/db/schemas/salesfront"

export const SalesfrontModel =
  mongoose.models?.Salesfront || mongoose.model("Salesfront", salesfrontSchema)
