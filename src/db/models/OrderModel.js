import mongoose from "mongoose"
import { orderSchema } from "@/db/schemas/orderSchema"

export const OrderModel =
  mongoose.models?.Order || mongoose.model("Order", orderSchema)
