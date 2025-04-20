import { generateUniqueShortId } from "@/lib/utils"
import mongoose, { Schema } from "mongoose"

export const orderSchema = new Schema(
  {
    shortId: {
      type: String,
      unique: true,
      index: true,
    },

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
      sessionId: { type: String, required: true, unique: true },
      subscriptionId: { type: String },
      amountTotal: { type: Number, required: true },
      amountSubtotal: { type: Number, required: true },
      currency: { type: String, default: "eur" },
      paymentMethod: { type: String },
      paymentStatus: { type: String },
      voucherCode: { type: String },
      amountTax: { type: Number },
      amountDiscount: { type: Number },
      invoiceId: { type: String },
      paymentIntentId: { type: String },
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
        "PROCESSING",
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
            "PROCESSING",
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

orderSchema.pre("save", async function ValidateShortId(next) {
  if (!this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Order.exists({ shortId: newId })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
