import { Schema } from "mongoose"

export const categorieSchema = new Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  isActive: {
    type: Boolean, default: true, required: true
  },
  picture: { type: String },
})
