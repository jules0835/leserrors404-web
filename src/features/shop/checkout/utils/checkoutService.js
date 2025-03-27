/* eslint-disable camelcase */
/* eslint-disable max-depth */
import stripe from "@/utils/stripe/stripe"
import { createOrder } from "@/db/crud/orderCrud"
import { findUserByStripeId } from "@/db/crud/userCrud"
import { getProductByStripeId } from "@/db/crud/productCrud"
import { resetUserCart } from "@/db/crud/cartCrud"
import { createSubscription } from "@/db/crud/subscriptionCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getVoucherCodeByStripeId } from "@/db/crud/voucherCrud"

export const createPaymentOrder = async (sessionId, origin) => {
  let order = null
  let stripeSubscription = null

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return {
        isOrderCreated: false,
        isSessionExist: false,
        isPaymentFound: false,
      }
    }

    if (session.status !== "complete") {
      return {
        isOrderCreated: false,
        isSessionExist: true,
        isPaymentFound: false,
      }
    }

    const user = await findUserByStripeId(session.customer)
    const sessionProducts =
      await stripe.checkout.sessions.listLineItems(sessionId)
    const products = await Promise.all(
      sessionProducts.data.map(async (product) => {
        const dbProduct = await getProductByStripeId(product.price.product.id)
        const getBillingCycle = (recurring) => {
          if (!recurring) {
            return "one_time"
          }

          return recurring.interval === "month" ? "monthly" : "annual"
        }
        const billingCycle = getBillingCycle(product.price.recurring)

        return {
          productId: dbProduct._id,
          quantity: product.quantity,
          billingCycle,
          price: product.amount_subtotal / 100,
          stripePriceId: product.price.id,
          totalTax: product.amount_tax / 100,
        }
      })
    )
    const promotionCode = await getVoucherCodeByStripeId(
      session.discounts[0]?.promotion_code
    )
    const orderData = {
      user: user._id,
      userEmail: user.email,
      stripe: {
        sessionId: session.id,
        amountTotal: session.amount_total / 100,
        currency: session.currency,
        paymentStatus: session.payment_status,
        paymentMethod: session.payment_method_types[0],
        voucherCode: promotionCode?.code || null,
        amountSubtotal: session.amount_subtotal / 100,
        amountTax: session.total_details.amount_tax / 100,
        amountDiscount: session.total_details.amount_discount / 100,
        invoiceId: session.invoice,
        paymentIntentId: session.payment_intent,
      },
      products,
      orderStatus: "PAID",
      statusHistory: [
        {
          status: "PAID",
          updatedBy: "system",
          details: `Payment successful. Started by ${origin}`,
        },
      ],
    }
    order = await createOrder(orderData)

    if (session.mode === "subscription") {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription
        )
        const subscriptionItems = await stripe.subscriptionItems.list({
          subscription: stripeSubscription.id,
          expand: ["data.price.product"],
        })
        const items = await Promise.all(
          subscriptionItems.data.map(async (item) => {
            const dbProduct = await getProductByStripeId(item.price.product.id)
            const billingCycle =
              item.price.recurring.interval === "month" ? "monthly" : "annual"

            return {
              productId: dbProduct._id,
              billingCycle,
              stripe: {
                priceId: item.price.id,
                itemId: item.id,
                quantity: item.quantity || 1,
              },
            }
          })
        )
        const subscriptionData = {
          user: user._id,
          userEmail: user.email,
          orderId: order._id,
          stripe: {
            subscriptionId: stripeSubscription.id,
            status: stripeSubscription.status,
            periodStart: new Date(
              stripeSubscription.current_period_start * 1000
            ),
            periodEnd: new Date(stripeSubscription.current_period_end * 1000),
            canceledAt: stripeSubscription.canceled_at
              ? new Date(stripeSubscription.canceled_at * 1000)
              : null,
            customerId: stripeSubscription.customer,
            defaultPaymentMethod: stripeSubscription.default_payment_method,
            latestInvoiceId: stripeSubscription.latest_invoice,
          },
          items,
          statusHistory: [
            {
              status: stripeSubscription.status,
              updatedBy: "system",
              details: `Subscription created from ${origin}`,
            },
          ],
        }
        const subscriptionResult = await createSubscription(subscriptionData)

        order.stripe.subscriptionId = subscriptionResult.stripe.subscriptionId
        order.stripe.isSubscription = true

        await order.save()
      } catch (subscriptionError) {
        log.systemError({
          logKey: logKeys.shopStripeWebhookError.key,
          message: "Failed to create subscription",
          technicalMessage: subscriptionError.message,
          data: {
            error: subscriptionError,
            orderId: order._id,
            sessionId,
            subscriptionId: session.subscription,
          },
          isError: true,
        })

        if (stripeSubscription) {
          await stripe.subscriptions.del(stripeSubscription.id)
        }

        order.orderStatus = "CANCEL"
        order.statusHistory.push({
          status: "CANCEL",
          updatedBy: "system",
          details: `Order cancelled due to subscription creation failure: ${subscriptionError.message}`,
        })
        await order.save()

        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        )

        if (paymentIntent.status === "succeeded") {
          await stripe.refunds.create({
            payment_intent: session.payment_intent,
          })
        }

        return {
          isOrderCreated: true,
          order,
          isSessionExist: true,
          error: "Failed to create subscription",
        }
      }
    }

    await resetUserCart(user._id)

    return { isOrderCreated: true, order, isSessionExist: true }
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: "Failed to process payment order",
      technicalMessage: error.message,
      data: {
        error,
        sessionId,
        orderId: order?._id,
      },
      isError: true,
    })

    if (order) {
      order.orderStatus = "CANCEL"
      order.statusHistory.push({
        status: "CANCEL",
        updatedBy: "system",
        details: `Order cancelled due to error: ${error.message}`,
      })
      await order.save()

      log.systemError({
        logKey: logKeys.shopStripeWebhookError.key,
        message: "Refunded payment because of error during order creation",
        technicalMessage: error.message,
        data: { error, sessionId, orderId: order?._id },
        isError: true,
      })
    }

    throw error
  }
}

export const checkPaymentOrder = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (!session) {
    return {
      isOrderCreated: false,
      isSessionExist: false,
      isPaymentFound: false,
    }
  }

  if (session.status !== "complete") {
    return {
      isOrderCreated: false,
      isSessionExist: true,
      isPaymentFound: false,
    }
  }

  return {
    isOrderCreated: false,
    isSessionExist: false,
    isPaymentFound: false,
  }
}
