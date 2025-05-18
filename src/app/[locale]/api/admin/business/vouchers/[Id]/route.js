import { mwdb } from "@/api/mwdb"
import stripe from "@/utils/stripe/stripe"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findVoucherById } from "@/db/crud/voucherCrud"
import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await findVoucherById(Id)

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 })
    }

    if (!voucher.stripeCouponId) {
      return NextResponse.json(
        { error: "Stripe coupon ID not found" },
        { status: 400 }
      )
    }

    voucher.isActive = !voucher.isActive
    await voucher.save()

    await stripe.promotionCodes.update(voucher.stripeCouponId, {
      metadata: { isActive: voucher.isActive.toString() },
    })

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Voucher updated",
      data: {
        voucherId: Id,
        voucher,
      },
    })

    return NextResponse.json(voucher)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to update voucher status",
      error,
    })

    return NextResponse.json(
      { error: "Failed to update voucher status" },
      { status: 500 }
    )
  }
}

export async function GET(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await findVoucherById(Id)

    if (!voucher) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 })
    }

    return NextResponse.json(voucher)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to get voucher",
      error,
    })

    return NextResponse.json(
      { error: "Failed to get voucher" },
      { status: 500 }
    )
  }
}
