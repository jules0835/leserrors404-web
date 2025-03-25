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
