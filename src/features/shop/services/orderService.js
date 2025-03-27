/* eslint-disable camelcase */
import { getOrderById, updateOrderStatus } from "@/db/crud/orderCrud"
import stripe from "@/utils/stripe/stripe"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export const cancelOrderWithRefund = async (
  orderId,
  paymentIntentId,
  userFormated
) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  let refundCreated = false

  if (paymentIntent.id) {
    await stripe.refunds.create({
      payment_intent: paymentIntent.id,
    })
    refundCreated = true
  }

  await updateOrderStatus(
    orderId,
    "CANCEL",
    "Order canceled by admin with refund",
    userFormated
  )

  if (refundCreated) {
    const updatedOrder = await updateOrderStatus(
      orderId,
      "REFUND",
      "Order refunded by admin",
      userFormated
    )

    log.systemInfo({
      logKey: logKeys.orderUpdate.key,
      message: "Order canceled and refunded successfully",
      data: { orderId },
    })

    return updatedOrder
  }

  log.systemInfo({
    logKey: logKeys.orderUpdate.key,
    message: "Order canceled successfully, no refund process created",
    data: { orderId },
  })

  return await getOrderById(orderId)
}

export const cancelOrderWithoutRefund = async (orderId, userFormated) => {
  const updatedOrder = await updateOrderStatus(
    orderId,
    "CANCEL",
    "Order canceled by admin without refund",
    userFormated
  )

  log.systemInfo({
    logKey: logKeys.orderUpdate.key,
    message: "Order canceled without refund successfully",
    data: { orderId },
  })

  return updatedOrder
}
