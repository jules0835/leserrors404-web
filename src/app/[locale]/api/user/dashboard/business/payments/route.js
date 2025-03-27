import { findUserById } from "@/db/crud/userCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import stripe from "@/utils/stripe/stripe"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const user = await findUserById(userId)

    if (!user) {
      log.systemSecurity({
        logKey: logKeys.securityError.key,
        message: "Unauthorized access to payments",
        data: {
          userId,
        },
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!user.account.stripe.customerId) {
      return NextResponse.json(
        { error: "No stripe customer id", hasPortalAccess: false },
        { status: 400 }
      )
    }

    const [paymentMethods, invoices] = await Promise.all([
      stripe.paymentMethods.list({
        customer: user.account.stripe.customerId,
        type: "card",
      }),
      stripe.invoices.list({
        customer: user.account.stripe.customerId,
        limit: 100,
      }),
    ])

    return NextResponse.json({
      paymentMethods,
      invoices,
      hasPortalAccess: true,
      userId,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get payments",
      technicalMessage: error.message,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
