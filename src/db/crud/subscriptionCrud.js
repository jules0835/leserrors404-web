/* eslint-disable max-params */
import { SubscriptionModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export const createSubscription = async (subscription) => {
  await mwdb()

  return await SubscriptionModel.create(subscription)
}

export const getSubscriptionById = async (subscriptionId) => {
  await mwdb()
  const subscription = await SubscriptionModel.findById(subscriptionId)
    .populate("items.productId")
    .populate("user", "firstName lastName email")
    .populate("orderId")

  return subscription || null
}

export const getSubscriptionsByUserId = async (
  userId,
  size = 10,
  page = 1,
  sort = { createdAt: -1 }
) => {
  await mwdb()
  const searchQuery = { user: userId }
  const total = await SubscriptionModel.countDocuments(searchQuery)
  const subscriptions = await SubscriptionModel.find(searchQuery)
    .populate("items.productId")
    .populate("user", "firstName lastName email")
    .populate("orderId")
    .sort(sort)
    .limit(size)
    .skip(size * (page - 1))

  return { subscriptions, total }
}

export const updateSubscription = async (subscriptionId, update) => {
  await mwdb()

  return await SubscriptionModel.findByIdAndUpdate(subscriptionId, update, {
    new: true,
  })
}

export const findSubscriptionByStripeId = async (stripeId) => {
  await mwdb()

  return await SubscriptionModel.findOne({ "stripe.subscriptionId": stripeId })
}

export const getAllSubscriptions = async (
  size = 10,
  page = 1,
  sort = { createdAt: -1 },
  filters = {}
) => {
  await mwdb()
  const searchQuery = { ...filters }
  const total = await SubscriptionModel.countDocuments(searchQuery)
  const subscriptions = await SubscriptionModel.find(searchQuery)
    .populate("items.productId")
    .populate("user", "firstName lastName email")
    .populate("orderId")
    .sort(sort)
    .limit(size)
    .skip(size * (page - 1))
    .lean()

  return { subscriptions, total }
}
