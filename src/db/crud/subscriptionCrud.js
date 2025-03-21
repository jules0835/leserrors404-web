import { SubscriptionModel } from "@/db/models/SubscriptionModel"
import { mwdb } from "@/api/mwdb"

export const createSubscription = async (subscription) => {
  await mwdb()

  return await SubscriptionModel.create(subscription)
}
