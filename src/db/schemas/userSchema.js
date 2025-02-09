import { Schema } from "mongoose"

export const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isEmployee: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  profilePicture: { type: String },
  isConfirmed: { type: Boolean, default: false },
  howDidYouHear: { type: String, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    street: { type: String, required: true },
  },
})
