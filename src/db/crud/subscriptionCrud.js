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

export const getSubscriptionStats = async ({
  period = "7d",
  realTime = false,
}) => {
  await mwdb()

  const matchQuery = {}

  if (!realTime) {
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7)

        break

      case "30d":
        startDate.setDate(startDate.getDate() - 30)

        break

      case "90d":
        startDate.setDate(startDate.getDate() - 90)

        break
    }

    matchQuery.createdAt = { $gte: startDate }
  }

  const activeSubscriptions = await SubscriptionModel.countDocuments({
    ...matchQuery,
    "stripe.status": "active",
  })
  const canceledSubscriptions = await SubscriptionModel.countDocuments({
    ...matchQuery,
    "stripe.status": "canceled",
  })
  const pastDueSubscriptions = await SubscriptionModel.countDocuments({
    ...matchQuery,
    "stripe.status": "past_due",
  })
  const statusDistribution = await SubscriptionModel.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: "$stripe.status",
        count: { $sum: 1 },
      },
    },
  ])
  const billingCycleDistribution = await SubscriptionModel.aggregate([
    {
      $match: matchQuery,
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.billingCycle",
        count: { $sum: 1 },
      },
    },
  ])
  const topProducts = await SubscriptionModel.aggregate([
    {
      $match: matchQuery,
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.productId",
        subscriptionCount: { $sum: 1 },
        totalQuantity: { $sum: "$items.stripe.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        productId: "$_id",
        productName: "$productDetails.label",
        subscriptionCount: 1,
        totalQuantity: 1,
      },
    },
    {
      $sort: { subscriptionCount: -1 },
    },
    {
      $limit: 10,
    },
  ])
  const totalSubscriptions = await SubscriptionModel.countDocuments(matchQuery)

  return {
    activeSubscriptions,
    canceledSubscriptions,
    pastDueSubscriptions,
    statusDistribution,
    billingCycleDistribution,
    topProducts,
    totalSubscriptions,
  }
}
