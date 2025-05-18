/* eslint-disable camelcase */
import { logKeys } from "@/assets/options/config"
import { findUserById } from "@/db/crud/userCrud"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { Id } = await params
    const { searchParams } = new URL(req.url)
    const returnUrl = searchParams.get("returnUrl")
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)
    const user = await findUserById(Id)

    if (!isAdmin && user._id.toString() !== userId) {
      log.systemSecurity({
        logKey: logKeys.securityError.key,
        message: "Unauthorized access to billing portal",
        data: {
          userId,
          user,
          isAdmin,
        },
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!user.account.stripe.customerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.account.stripe.customerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ portalUrl: session.url })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to create billing portal session",
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
