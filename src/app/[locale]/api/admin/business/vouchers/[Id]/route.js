import { mwdb } from "@/api/mwdb"
import stripe from "@/utils/stripe/stripe"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findVoucherById } from "@/db/crud/voucherCrud"

export async function PUT(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await findVoucherById(Id)

    if (!voucher) {
      return new Response(JSON.stringify({ error: "Voucher not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!voucher.stripeCouponId) {
      return new Response(
        JSON.stringify({ error: "Stripe coupon ID not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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

    return new Response(JSON.stringify(voucher), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to update voucher status",
      error,
    })

    return new Response(
      JSON.stringify({ error: "Failed to update voucher status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export async function GET(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await findVoucherById(Id)

    if (!voucher) {
      return new Response(JSON.stringify({ error: "Voucher not found" }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(voucher), {
      status: 200,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to get voucher",
      error,
    })

    return new Response(JSON.stringify({ error: "Failed to get voucher" }), {
      status: 500,
    })
  }
}
