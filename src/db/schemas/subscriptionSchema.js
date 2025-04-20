import mongoose, { Schema } from "mongoose"
import { generateUniqueShortId } from "@/lib/utils"

export const subscriptionSchema = new Schema(
  {
    shortId: {
      type: String,
      unique: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    stripe: {
      subscriptionId: { type: String, required: true, unique: true },
      status: {
        type: String,
        enum: [
          "incomplete",
          "incomplete_expired",
          "trialing",
          "active",
          "past_due",
          "canceled",
          "unpaid",
          "paused",
          "preCanceled",
        ],
        default: "active",
      },
      periodStart: { type: Date, required: true },
      periodEnd: { type: Date, required: true },
      canceledAt: { type: Date },
      customerId: { type: String, required: true },
      defaultPaymentMethod: { type: String },
      latestInvoiceId: { type: String },
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
          enum: ["month", "year"],
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
          enum: [
            "incomplete",
            "incomplete_expired",
            "trialing",
            "active",
            "past_due",
            "canceled",
            "unpaid",
            "paused",
            "preCanceled",
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

subscriptionSchema.pre("save", async function ValidateShortId(next) {
  if (!this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Subscription.exists({
        shortId: newId,
      })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
