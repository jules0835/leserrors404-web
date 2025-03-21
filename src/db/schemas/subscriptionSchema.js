import { Schema } from "mongoose"

export const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    stripe: {
      subscriptionId: { type: String, required: true },
      status: {
        type: String,
        enum: ["ACTIVE", "CANCELED", "PAST_DUE", "UNPAID"],
        default: "ACTIVE",
      },
      periodStart: { type: Date, required: true },
      periodEnd: { type: Date, required: true },
      canceledAt: { type: Date },
      customerId: { type: String, required: true },
      defaultPaymentMethod: { type: String },
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        billingCycle: {
          type: String,
          enum: ["monthly", "annual"],
          required: true,
        },
        stripe: {
          priceId: { type: String, required: true },
          itemId: { type: String, required: true },
          quantity: { type: Number, default: 1 },
        },
      },
    ],

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["ACTIVE", "CANCELED", "PAST_DUE", "UNPAID"],
          required: true,
        },
        changedAt: { type: Date, default: Date.now },
        updatedBy: { type: String, required: true },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
)
