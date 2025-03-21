import { Schema } from "mongoose"

export const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        billingCycle: {
          type: String,
          enum: ["monthly", "annual", "one_time"],
          required: true,
        },
        price: { type: Number, required: true },
        stripePriceId: { type: String, required: true },
        totalTax: { type: Number, required: true },
      },
    ],

    stripe: {
      sessionId: { type: String, required: true },
      paymentIntentId: { type: String },
      subscriptionId: { type: String },
      amountTotal: { type: Number, required: true },
      currency: { type: String, default: "eur" },
    },

    orderStatus: {
      type: String,
      enum: [
        "RECEIVED",
        "PAID",
        "CANCEL",
        "REFUND",
        "PENDING",
        "FAILED",
        "COMPLETED",
        "WAITING_COMPLETION",
      ],
      default: "RECEIVED",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "RECEIVED",
            "PAID",
            "CANCEL",
            "REFUND",
            "PENDING",
            "FAILED",
            "COMPLETED",
            "WAITING_COMPLETION",
          ],
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
