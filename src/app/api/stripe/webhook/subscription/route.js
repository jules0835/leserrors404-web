import { logKeys } from "@/assets/options/config"
import log from "@/lib/log"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"
import {
  findSubscriptionByStripeId,
  updateSubscription,
} from "@/db/crud/subscriptionCrud"

export async function POST(req) {
  let event = null
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: "No signature on subscription webhook",
    })

    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_SUBSCRIPTION
    )
  } catch (errorWebhook) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: "Failed to construct event on subscription webhook",
      technicalMessage: errorWebhook.message,
    })

    return NextResponse.json({ error: errorWebhook.message }, { status: 400 })
  }

  log.systemInfo({
    logKey: logKeys.shopStripeWebhook.key,
    message: "New subscription webhook received",
    data: event,
  })

  const subscriptionData = event.data.object

  switch (event.type) {
    case "customer.subscription.updated":
      try {
        const existingSubscription = await findSubscriptionByStripeId(
          subscriptionData.id
        )

        if (!existingSubscription) {
          log.systemError({
            logKey: logKeys.shopStripeWebhookError.key,
            message: `Subscription not found: ${subscriptionData.id}`,
          })

          return NextResponse.json(
            { error: "Subscription not found" },
            { status: 404 }
          )
        }

        const alreadyUpdated =
          existingSubscription.stripe.status === subscriptionData.status &&
          existingSubscription.stripe.periodEnd.getTime() ===
            subscriptionData.current_period_end * 1000 &&
          existingSubscription.stripe.defaultPaymentMethod ===
            subscriptionData.default_payment_method &&
          existingSubscription.stripe.latestInvoiceId ===
            subscriptionData.latest_invoice

        if (alreadyUpdated) {
          log.systemInfo({
            logKey: logKeys.shopStripeWebhook.key,
            message: "Webhook received but subscription already updated",
            data: { subscriptionId: subscriptionData.id },
          })

          return NextResponse.json(
            { message: "Already updated" },
            { status: 200 }
          )
        }

        existingSubscription.stripe.status = subscriptionData.status
        existingSubscription.stripe.periodStart = new Date(
          subscriptionData.current_period_start * 1000
        )
        existingSubscription.stripe.periodEnd = new Date(
          subscriptionData.current_period_end * 1000
        )
        existingSubscription.stripe.canceledAt = subscriptionData.canceled_at
          ? new Date(subscriptionData.canceled_at * 1000)
          : null
        existingSubscription.stripe.defaultPaymentMethod =
          subscriptionData.default_payment_method
        existingSubscription.stripe.latestInvoiceId =
          subscriptionData.latest_invoice

        existingSubscription.statusHistory.push({
          status: subscriptionData.status,
          updatedBy: "stripe-webhook",
          details: `Subscription ${event.type.replace(
            "customer.subscription.",
            ""
          )} via Stripe webhook`,
        })

        await updateSubscription(existingSubscription._id, existingSubscription)

        log.systemInfo({
          logKey: logKeys.shopStripeWebhook.key,
          message: `Subscription ${event.type.replace(
            "customer.subscription.",
            ""
          )}`,
          data: existingSubscription,
        })

        return NextResponse.json(
          { message: `Subscription ${event.type} handled` },
          { status: 200 }
        )
      } catch (error) {
        log.systemError({
          logKey: logKeys.shopStripeWebhookError.key,
          message: `Failed to handle subscription ${event.type}`,
          technicalMessage: error.message,
        })

        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        )
      }

    default:
      log.systemError({
        logKey: logKeys.shopStripeWebhookError.key,
        message: "Unhandled event type on subscription webhook",
        data: event,
      })

      return NextResponse.json(
        { error: "Unhandled event type" },
        { status: 400 }
      )
  }
}
