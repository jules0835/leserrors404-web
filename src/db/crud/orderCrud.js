/* eslint-disable max-params */
import { OrderModel, SubscriptionModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export const createOrder = async (order) => {
  await mwdb()

  const newOrder = await OrderModel.create(order)

  return newOrder
}

export const checkOrderExistBySessionId = async (sessionId) => {
  await mwdb()

  const order = await OrderModel.findOne({ "stripe.sessionId": sessionId })

  return order ? order._id : null
}

export const getOrderById = async (orderId) => {
  await mwdb()

  const order = await OrderModel.findById(orderId)
    .populate("products.productId")
    .populate("user", "firstName lastName email")
    .lean()

  if (order && order.stripe.subscriptionId) {
    const subscription = await SubscriptionModel.findOne({
      "stripe.subscriptionId": order.stripe.subscriptionId,
    }).lean()

    if (subscription) {
      order.subscription = subscription
    }
  }

  return order || null
}

export const getOrdersByUserId = async (
  userId,
  size = 10,
  page = 1,
  sort = { createdAt: -1 }
) => {
  await mwdb()
  const searchQuery = { user: userId }
  const total = await OrderModel.countDocuments(searchQuery)
  const orders = await OrderModel.find(searchQuery)
    .populate("products.productId")
    .populate("user", "firstName lastName email")
    .sort(sort)
    .limit(size)
    .skip(size * (page - 1))

  return { orders, total }
}

export const getOrderByInvoiceId = async (invoiceId) => {
  await mwdb()

  return OrderModel.findOne({ "stripe.invoiceId": invoiceId })
}

export const getAllOrders = async (
  size = 10,
  page = 1,
  sort = { createdAt: -1 },
  filters = {}
) => {
  await mwdb()
  const searchQuery = { ...filters }
  const total = await OrderModel.countDocuments(searchQuery)
  const orders = await OrderModel.find(searchQuery)
    .populate("products.productId")
    .populate("user", "firstName lastName email")
    .sort(sort)
    .limit(size)
    .skip(size * (page - 1))
    .lean()
  const ordersWithSubscriptions = await Promise.all(
    orders.map(async (order) => {
      if (order.stripe.subscriptionId) {
        const subscription = await SubscriptionModel.findOne({
          "stripe.subscriptionId": order.stripe.subscriptionId,
        }).lean()

        if (subscription) {
          order.subscription = subscription
        }
      }

      return order
    })
  )

  return { orders: ordersWithSubscriptions, total }
}

export const updateOrderStatus = async (
  orderId,
  status,
  details,
  updatedBy
) => {
  await mwdb()

  const order = await OrderModel.findById(orderId)

  if (!order) {
    throw new Error("Order not found")
  }

  order.statusHistory.push({
    status,
    changedAt: new Date(),
    updatedBy,
    details,
  })

  order.orderStatus = status

  const updatedOrder = await order.save()

  return updatedOrder
}

export const getSalesStats = async ({
  size = 10,
  page = 1,
  groupBy = "day",
  period = "7d",
  productType = null,
  realTime = false,
}) => {
  await mwdb()

  const startDate = new Date()

  if (!realTime) {
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
  }

  const matchQuery = {}

  if (!realTime) {
    matchQuery.createdAt = { $gte: startDate }
  }

  if (productType && productType !== null) {
    matchQuery["products.productId.type"] = productType
  }

  const groupQuery = {
    _id: {
      $dateToString: {
        format: (() => {
          if (groupBy === "day") {
            return "%Y-%m-%d"
          }

          if (groupBy === "week") {
            return "%Y-%U"
          }

          return "%Y-%m"
        })(),
        date: "$createdAt",
      },
    },
    totalSales: { $sum: "$stripe.amountTotal" },
    orderCount: { $sum: 1 },
    averageOrderValue: { $avg: "$stripe.amountTotal" },
    products: { $push: "$products" },
  }
  const stats = await OrderModel.aggregate([
    { $match: matchQuery },
    { $group: groupQuery },
    { $sort: { _id: 1 } },
    { $skip: (page - 1) * size },
    { $limit: size },
  ])
  const total = await OrderModel.countDocuments(matchQuery)

  return {
    stats,
    total,
    page,
    size,
  }
}

export const getTodayOrdersCount = async () => {
  await mwdb()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await OrderModel.countDocuments({
    createdAt: { $gte: today },
  })
}
