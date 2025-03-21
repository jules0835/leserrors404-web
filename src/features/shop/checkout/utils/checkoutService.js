import stripe from "@/utils/stripe/stripe"
import { createOrder } from "@/db/crud/orderCrud"
import { findUserByStripeId } from "@/db/crud/userCrud"
import { getProductByStripeId } from "@/db/crud/productCrud"
import { resetUserCart } from "@/db/crud/cartCrud"
import { createSubscription } from "@/db/crud/subscriptionCrud"

export const createPaymentOrder = async (sessionId, origin) => {
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
      error: "Payment not found",
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
  const orderData = {
    user: user._id,
    userEmail: user.email,
    stripe: {
      sessionId: session.id,
      amountTotal: session.amount_total / 100,
      currency: session.currency,
      paymentStatus: session.status.toUpperCase(),
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
  const order = await createOrder(orderData)

  if (session.mode === "subscription") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    )
    const subscriptionItems = await stripe.subscriptionItems.list({
      subscription: subscription.id,
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
        subscriptionId: subscription.id,
        status: subscription.status.toUpperCase(),
        periodStart: new Date(subscription.current_period_start * 1000),
        periodEnd: new Date(subscription.current_period_end * 1000),
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        customerId: subscription.customer,
        defaultPaymentMethod: subscription.default_payment_method,
      },
      items,
      statusHistory: [
        {
          status: subscription.status.toUpperCase(),
          updatedBy: "system",
          details: `Subscription created from ${origin}`,
        },
      ],
    }

    await createSubscription(subscriptionData)
  }

  await resetUserCart(user._id)

  return { isOrderCreated: true, order, isSessionExist: true }
}
