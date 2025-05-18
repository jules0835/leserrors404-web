import mongoose from "mongoose"
import { productSchema } from "@/db/schemas/productSchema"

export const ProductModel =
  mongoose.models?.Product || mongoose.model("Product", productSchema)
