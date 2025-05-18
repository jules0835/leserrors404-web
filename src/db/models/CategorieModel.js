import mongoose from "mongoose"
import { categorieSchema } from "@/db/schemas/categorieSchema"

export const CategorieModel =
  mongoose.models?.Categorie || mongoose.model("Categorie", categorieSchema)
