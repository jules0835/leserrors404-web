/* eslint-disable max-params */
import { OrderModel } from "@/db/models/OrderModel"
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
