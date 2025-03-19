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
