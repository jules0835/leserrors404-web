import { Schema } from "mongoose"

export const categorieSchema = new Schema({
  label: { type: Object, required: true },
  description: { type: Object, required: true, default: {} },
  isActive: {
    type: Boolean, default: true, required: true
  },
  picture: { type: String },
})
