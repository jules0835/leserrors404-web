import { Schema } from "mongoose"

export const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      billingCycle: {
        type: String,
        enum: ["month", "year"],
        default: "month",
      },
    },
  ],
  voucher: { type: Schema.Types.ObjectId, ref: "Voucher" },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  checkout: {
    isEligible: { type: Boolean, default: false },
    reason: { type: String, default: "" },
  },
  billingAddress: {
    name: { type: String },
    country: { type: String },
    city: { type: String },
    zipCode: { type: String },
    street: { type: String },
  },
})
