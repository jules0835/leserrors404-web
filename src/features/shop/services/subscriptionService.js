import {
  updateSubscription,
  findSubscriptionByStripeId,
} from "@/db/crud/subscriptionCrud"
import stripe from "@/utils/stripe/stripe"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export const cancelSubscriptionWithFullRefund = async (
  subscriptionId,
  latestInvoice
) => {
  const subscription = await findSubscriptionByStripeId(subscriptionId)

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (subscription.stripe.status === "canceled") {
    log.systemInfo({
      logKey: logKeys.shopStripeWebhook.key,
      message: "Subscription already canceled",
      data: { subscriptionId },
    })

    return subscription
  }

  await stripe.subscriptions.cancel(subscriptionId)
  await stripe.refunds.create({
    paymentIntent: latestInvoice.paymentIntent,
  })

  await updateSubscription(subscription._id, {
    "stripe.status": "canceled",
    "stripe.canceledAt": new Date(),
  })

  return subscription
}

export const cancelSubscriptionAtPeriodEnd = async (
  subscriptionId,
  currentPeriodEnd
) => {
  const subscription = await findSubscriptionByStripeId(subscriptionId)

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (
    subscription.stripe.status === "canceled" ||
    subscription.stripe.status === "preCanceled"
  ) {
    log.systemInfo({
      logKey: logKeys.shopStripeWebhook.key,
      message: "Subscription already canceled or pre-canceled",
      data: { subscriptionId },
    })

    return subscription
  }

  await stripe.subscriptions.update(subscriptionId, {
    cancelAtPeriodEnd: true,
  })

  await updateSubscription(subscription._id, {
    "stripe.status": "preCanceled",
    "stripe.canceledAt": new Date(currentPeriodEnd * 1000),
  })

  return subscription
}

export const cancelSubscriptionWithPartialRefund = async (
  subscriptionId,
  latestInvoice
) => {
  const subscription = await findSubscriptionByStripeId(subscriptionId)

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (subscription.stripe.status === "canceled") {
    log.systemInfo({
      logKey: logKeys.shopStripeWebhook.key,
      message: "Subscription already canceled",
      data: { subscriptionId },
    })

    return subscription
  }

  await stripe.subscriptions.cancel(subscriptionId, {
    invoiceNow: true,
    prorate: true,
  })

  const prorationInvoice = await stripe.invoices.retrieve(latestInvoice.id)

  if (prorationInvoice.amountRemaining > 0) {
    await stripe.refunds.create({
      paymentIntent: prorationInvoice.paymentIntent,
      amount: prorationInvoice.amountRemaining,
    })
  }

  await updateSubscription(subscription._id, {
    "stripe.status": "canceled",
    "stripe.canceledAt": new Date(),
  })

  return subscription
}

export const cancelSubscriptionWithoutRefund = async (subscriptionId) => {
  const subscription = await findSubscriptionByStripeId(subscriptionId)

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (subscription.stripe.status === "canceled") {
    log.systemInfo({
      logKey: logKeys.shopStripeWebhook.key,
      message: "Subscription already canceled",
      data: { subscriptionId },
    })

    return subscription
  }

  await stripe.subscriptions.cancel(subscriptionId)

  await updateSubscription(subscription._id, {
    "stripe.status": "canceled",
    "stripe.canceledAt": new Date(),
  })

  return subscription
}

export const handleSubscriptionDeleted = async (subscriptionData) => {
  const subscription = await findSubscriptionByStripeId(subscriptionData.id)

  if (!subscription) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: `Subscription not found: ${subscriptionData.id}`,
    })
    throw new Error("Subscription not found")
  }

  if (subscription.stripe.status === "canceled") {
    return subscription
  }

  subscription.stripe.status = subscriptionData.status
  subscription.stripe.periodStart = new Date(
    subscriptionData.currentPeriodStart * 1000
  )
  subscription.stripe.periodEnd = new Date(
    subscriptionData.currentPeriodEnd * 1000
  )
  subscription.stripe.canceledAt = subscriptionData.canceledAt
    ? new Date(subscriptionData.canceledAt * 1000)
    : null
  subscription.stripe.defaultPaymentMethod =
    subscriptionData.defaultPaymentMethod
  subscription.stripe.latestInvoiceId = subscriptionData.latestInvoice

  subscription.statusHistory.push({
    status: subscriptionData.status,
    updatedBy: "stripe-webhook",
    details: "Subscription deleted via Stripe webhook",
  })

  await updateSubscription(subscription._id, subscription)

  log.systemInfo({
    logKey: logKeys.shopStripeWebhook.key,
    message: "Subscription deleted",
    data: subscription,
  })

  return subscription
}
