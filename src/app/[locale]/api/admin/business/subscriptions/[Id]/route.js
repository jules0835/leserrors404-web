/* eslint-disable no-case-declarations */
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
  "preCanceled",
]

export async function GET(req, { params }) {
  const { Id } = await params
  const isAdmin = getReqIsAdmin(req)

  try {
    const subscription = await getSubscriptionById(Id)

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get subscription by id for admin",
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
  const { Id } = params
  const userId = getReqUserId(req)
  const isAdmin = getReqIsAdmin(req)

  try {
    const subscription = await getSubscriptionById(Id)
    const { action } = await req.json()

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let stripeSubscription = null

    switch (action) {
      case "cancel_at_period_end":
        if (subscription.stripe.status === "preCanceled") {
          return NextResponse.json(
            { error: "Subscription already pre-canceled" },
            { status: 400 }
          )
        }

        stripeSubscription = await stripe.subscriptions.update(
          subscription.stripe.subscriptionId,
          {
            cancel_at_period_end: true,
          }
        )

        break

      case "cancel_now_with_remaining_refund":
        if (subscription.stripe.status === "canceled") {
          return NextResponse.json(
            { error: "Subscription already canceled" },
            { status: 400 }
          )
        }

        stripeSubscription = await stripe.subscriptions.cancel(
          subscription.stripe.subscriptionId,
          {
            prorate: true,
            invoice_now: true,
          }
        )

        const latestInvoice = await stripe.invoices.retrieve(
          stripeSubscription.latest_invoice
        )

        if (latestInvoice.amount_remaining > 0) {
          await stripe.refunds.create({
            payment_intent: latestInvoice.payment_intent,
            amount: latestInvoice.amount_remaining,
            reason: "requested_by_customer",
          })
        }

        break

      case "cancel_now_with_full_refund":
        if (subscription.stripe.status === "canceled") {
          return NextResponse.json(
            { error: "Subscription already canceled" },
            { status: 400 }
          )
        }

        stripeSubscription = await stripe.subscriptions.cancel(
          subscription.stripe.subscriptionId,
          {
            prorate: true,
            invoice_now: true,
          }
        )

        const invoice = await stripe.invoices.retrieve(
          stripeSubscription.latest_invoice
        )

        if (invoice.amount_paid > 0) {
          await stripe.refunds.create({
            payment_intent: invoice.payment_intent,
            amount: invoice.amount_paid,
            reason: "requested_by_customer",
          })
        }

        break

      case "cancel_now_without_refund":
        if (subscription.stripe.status === "canceled") {
          return NextResponse.json(
            { error: "Subscription already canceled" },
            { status: 400 }
          )
        }

        stripeSubscription = await stripe.subscriptions.cancel(
          subscription.stripe.subscriptionId,
          {
            prorate: false,
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

    const newStatus =
      action === "cancel_at_period_end"
        ? "preCanceled"
        : stripeSubscription.status
    subscription.stripe.status = newStatus

    if (stripeSubscription.canceled_at) {
      subscription.stripe.canceledAt = new Date(
        stripeSubscription.canceled_at * 1000
      )
    }

    const statusDetails = {
      cancel_at_period_end: "Admin requested to cancel at period end",
      cancel_now_with_remaining_refund:
        "Admin requested to cancel immediately with remaining period refund",
      cancel_now_with_full_refund:
        "Admin requested to cancel immediately with full refund",
      cancel_now_without_refund:
        "Admin requested to cancel immediately without refund",
    }

    subscription.statusHistory.push({
      status: newStatus,
      updatedBy: `Admin - ${userId}`,
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
      isAdminAction: true,
      authorId: userId || null,
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
