import { logKeys } from "@/assets/options/config"
import {
  createPaymentOrder,
  createSubscriptionOrder,
} from "@/features/shop/checkout/utils/checkoutService"
import log from "@/lib/log"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"

export async function POST(req) {
  let event = null
  const body = await req.text()
  const sig = await req.headers.get("stripe-signature")

  if (!sig) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: "No signature on order webhook",
    })

    return NextResponse.json({ error: "Error" }, { status: 400 })
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (errorWebhook) {
    log.systemError({
      logKey: logKeys.shopStripeWebhookError.key,
      message: "Failed to construct event webhook on order webhook",
      technicalMessage: errorWebhook.message,
    })

    return NextResponse.json({ error: errorWebhook.message }, { status: 400 })
  }

  log.systemInfo({
    logKey: logKeys.shopStripeWebhook.key,
    message: "New order webhook received",
    data: event,
  })

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event?.data?.object

      try {
        if (session.mode === "subscription") {
          await createSubscriptionOrder(session)
        } else if (session.mode === "payment") {
          await createPaymentOrder(session.id, "Stripe Webhook Order")
        }

        log.systemInfo({
          logKey: logKeys.shopStripeWebhook.key,
          message: "Order created",
          data: session,
        })

        return NextResponse.json({ message: "Order created" }, { status: 200 })
      } catch (error) {
        log.systemError({
          logKey: logKeys.shopStripeWebhookError.key,
          message: "Failed to create order",
          technicalMessage: error.message,
        })

        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        )
      }
    }

    default:
      log.systemError({
        logKey: logKeys.shopStripeWebhookError.key,
        message: "Unhandled event type",
        data: event,
      })

      return NextResponse.json(
        { error: "Unhandled event type" },
        { status: 400 }
      )
  }
}
