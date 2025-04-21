import mongoose, { Schema } from "mongoose"
import { generateUniqueShortId } from "@/lib/utils"

export const categorieSchema = new Schema({
  shortId: {
    type: String,
    unique: true,
    index: true,
  },
  label: { type: Object, required: true },
  description: { type: Object, required: true, default: {} },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  picture: { type: String },
})

categorieSchema.pre("save", async function ValidateShortId(next) {
  if (!this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Categorie.exists({ shortId: newId })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
