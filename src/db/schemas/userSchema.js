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
    auth: {
      loginAttempts: { type: Number, default: 0 },
      isOtpEnabled: { type: Boolean, default: false },
      otpSecret: { type: String },
    },
    confirmation: {
      isConfirmed: { type: Boolean, default: false },
      confirmationDate: { type: Date },
      token: { type: String },
      lastSendTokenDate: { type: Date },
      expiresToken: { type: Date },
    },
    activation: {
      isActivated: { type: Boolean, default: true },
      inactivationDate: { type: Date },
      inactivationReason: { type: String },
    },
    resetPassword: {
      token: { type: String },
      expires: { type: Date },
    },
  },
})
