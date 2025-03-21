import mongoose from "mongoose"
import { subscriptionSchema } from "@/db/schemas/subscriptionSchema"

export const SubscriptionModel =
  mongoose.models?.Subscription ||
  mongoose.model("Subscription", subscriptionSchema)
