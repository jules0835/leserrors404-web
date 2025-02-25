import { Schema } from "mongoose"

export const productSchema = new Schema({
  label: { type: Object, required: true, unique: true },
  description: { type: Object, required: true, default: {} },
  characteristics: { type: Object, required: true, default: {} },
  categorie: { type: Schema.Types.ObjectId, ref: "Categorie" },
  stock: { type: Number, default: 0, required: true },
  price: { type: Number, default: 0, required: true },
  taxe: { type: Number, default: 0.20, required: true },
  subscription: { type: Boolean, default: false, required: true },
  priority: { type: Number, default: 0 },
  similarProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  isActive: {
    type: Boolean, default: true, required: true
  },
  picture: { type: String },
})
