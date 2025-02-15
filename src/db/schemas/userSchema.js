import { Schema } from "mongoose"

export const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isSuperAdmin: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  profilePicture: { type: String },
  howDidYouHear: { type: String, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    street: { type: String, required: true },
  },
  account: {
    confirmation: {
      isConfirmed: { type: Boolean, default: false },
      date: { type: Date },
    },
    activation: {
      isActivated: { type: Boolean, default: false },
      inactivationDate: { type: Date },
      inactivationReason: { type: String },
    },
    resetPassword: {
      token: { type: String },
      expires: { type: Date },
    },
    confirmEmail: {
      token: { type: String },
      expires: { type: Date },
    },
  },
})
