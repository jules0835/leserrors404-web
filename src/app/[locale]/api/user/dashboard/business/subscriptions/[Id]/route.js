/* eslint-disable camelcase */
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import { NextResponse } from "next/server"
import { getSubscriptionById } from "@/db/crud/subscriptionCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import stripe from "@/utils/stripe/stripe"

const VALID_SUBSCRIPTION_STATUSES = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]

export async function GET(req, { params }) {
  try {
    const { Id } = await params
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)
    const subscription = await getSubscriptionById(Id)

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (!isAdmin && subscription.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get subscription by id",
      technicalMessage: error.message,
      data: {
        error,
      },
      isError: true,
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req, { params }) {
  try {
    const { Id } = params
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)
    const subscription = await getSubscriptionById(Id)
    const { action } = await req.json()

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (!isAdmin && subscription.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let stripeSubscription = null

    switch (action) {
      case "cancel_at_period_end":
        stripeSubscription = await stripe.subscriptions.update(
          subscription.stripe.subscriptionId,
          {
            cancel_at_period_end: true,
          }
        )

        break

      case "cancel_immediately":
        stripeSubscription = await stripe.subscriptions.cancel(
          subscription.stripe.subscriptionId,
          {
            prorate: true,
            invoice_now: true,
          }
        )

        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!VALID_SUBSCRIPTION_STATUSES.includes(stripeSubscription.status)) {
      throw new Error(
        `Invalid subscription status: ${stripeSubscription.status}`
      )
    }

    subscription.stripe.status = stripeSubscription.status

    if (stripeSubscription.canceled_at) {
      subscription.stripe.canceledAt = new Date(
        stripeSubscription.canceled_at * 1000
      )
    }

    const statusDetails = {
      cancel_at_period_end: "Scheduled cancellation at period end",
      cancel_immediately: "Immediate cancellation with refund",
    }

    subscription.statusHistory.push({
      status: stripeSubscription.status,
      updatedBy: subscription.userEmail,
      details: statusDetails[action],
    })

    await subscription.save()

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to update subscription",
      technicalMessage: error.message,
      data: {
        error,
      },
      isError: true,
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
