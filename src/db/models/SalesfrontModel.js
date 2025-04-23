import mongoose from "mongoose"
import { salesfrontSchema } from "@/db/schemas/salesfrontSchema"

export const SalesfrontModel =
  mongoose.models?.Salesfront || mongoose.model("Salesfront", salesfrontSchema)
