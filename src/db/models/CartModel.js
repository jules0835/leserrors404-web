import mongoose from "mongoose"
import { cartSchema } from "@/db/schemas/cartSchema"

export const CartModel =
  mongoose.models?.Cart || mongoose.model("Cart", cartSchema)
