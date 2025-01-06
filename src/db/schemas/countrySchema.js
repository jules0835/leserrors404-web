import { Schema } from "mongoose"

export const countrySchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
})
