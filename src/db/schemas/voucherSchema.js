import { Schema } from "mongoose"

export const voucherSchema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true, enum: ["percentage", "fixed"] },
  amount: { type: Number, required: true },
  isActive: { type: Boolean, default: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  isUserSpecific: { type: Boolean, default: false },
  isProductSpecific: { type: Boolean, default: false },
  isCategorySpecific: { type: Boolean, default: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Categorie" }],
})
