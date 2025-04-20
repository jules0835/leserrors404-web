import mongoose, { Schema } from "mongoose"
import { generateUniqueShortId } from "@/lib/utils"

export const productSchema = new Schema({
  shortId: {
    type: String,
    unique: true,
    index: true,
  },
  label: { type: Object, required: true, unique: true },
  description: { type: Object, required: true, default: {} },
  characteristics: { type: Object, required: true, default: {} },
  categorie: { type: Schema.Types.ObjectId, ref: "Categorie" },
  stock: { type: Number, default: 0, required: true },
  price: {
    type: Number,
    validate: {
      validator(value) {
        return !this.subscription ? value !== null : true
      },
    },
  },
  priceMonthly: {
    type: Number,
    validate: {
      validator(value) {
        return this.subscription ? value !== null : true
      },
    },
  },
  priceAnnual: {
    type: Number,
    validate: {
      validator(value) {
        return this.subscription ? value !== null : true
      },
    },
  },
  stripeTaxId: { type: String },
  stripeProductId: { type: String },
  stripePriceIdMonthly: { type: String },
  stripePriceIdAnnual: { type: String },
  stripePriceId: { type: String },
  taxe: { type: Number, default: 20, required: true },
  subscription: { type: Boolean, default: false, required: true },
  priority: { type: Number, default: 0 },
  similarProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  isActive: { type: Boolean, default: true, required: true },
  picture: { type: String },
  __v: { type: Number, default: 0 },
})

productSchema.pre("save", async function ValidateShortId(next) {
  if (!this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Product.exists({ shortId: newId })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
