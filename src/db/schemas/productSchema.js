import { Schema } from "mongoose"

export const productSchema = new Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  characteristics: { type: String, required: true },
  categorie: { type: Schema.Types.ObjectId, ref: "Categorie" },
  stock: { type: Number, default: 0, required: true },
  price: { type: Number, default: 0, required: true },
  priority: { type: Number, default: 0 },
  similarProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  isActive: {
    type: Boolean, default: true, required: true
  },
  picture: { type: String },
})
