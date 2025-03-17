import { Schema } from "mongoose"

export const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ["percentage", "fixed"] },
  amount: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true, required: true },
  isSingleUse: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  minPurchaseAmount: { type: Number, default: 0 },
  description: { type: String },
  stripeCouponId: { type: String, required: true },
})
