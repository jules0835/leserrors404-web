import stripe from "@/utils/stripe/stripe"
import { createOrder } from "@/db/crud/orderCrud"
import { getUserIdByEmail } from "@/db/crud/userCrud"
import { getProductByStripeId } from "@/db/crud/productCrud"
import { resetUserCart } from "@/db/crud/cartCrud"

export const createSubscriptionOrder = (session) => {
  //Const subscription = await stripe.subscriptions.retrieve(session.subscription)

  const ses = session

  return ses
}

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

  const userId = await getUserIdByEmail(session.customer_email)
  const sessionProducts =
    await stripe.checkout.sessions.listLineItems(sessionId)
  const products = await Promise.all(
    sessionProducts.data.map(async (product) => {
      const dbProduct = await getProductByStripeId(product.price.product)

      return {
        productId: dbProduct._id,
        quantity: product.quantity,
        billingCycle: product.price.recurring
          ? product.price.recurring.interval
          : "one_time",
        price: product.amount_subtotal,
        stripePriceId: product.price.id,
      }
    })
  )
  const orderData = {
    user: userId,
    userEmail: session.customer_email,
    stripe: {
      sessionId: session.id,
      amountTotal: session.amount_total,
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
  await resetUserCart(userId)

  return { isOrderCreated: true, order, isSessionExist: true }
}
