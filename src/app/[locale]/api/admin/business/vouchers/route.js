/* eslint-disable camelcase */
import log from "@/lib/log"
import { getVouchersList, createVoucher } from "@/db/crud/voucherCrud"
import crypto from "crypto"
import { logKeys } from "@/assets/options/config"
import stripe from "@/utils/stripe/stripe"

export async function POST(req) {
  try {
    const data = await req.json()
    data.code ||= crypto.randomBytes(4).toString("hex").toUpperCase()

    const stripeCoupon = await stripe.coupons.create({
      duration: "once",
      amount_off: data.type === "fixed" ? data.amount * 100 : undefined,
      percent_off: data.type === "percentage" ? data.amount : undefined,
      currency: "eur",
    })
    const stripePromotionCode = await stripe.promotionCodes.create({
      coupon: stripeCoupon.id,
      code: data.code,
    })

    data.stripeCouponId = stripePromotionCode.id

    const newVoucher = await createVoucher(data)

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Voucher created",
      data: {
        voucher: newVoucher,
      },
    })

    return Response.json(newVoucher, { status: 201 })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to create voucher",
      isError: true,
      technicalMessage: error.message,
    })

    return Response.json({ error: "Failed to create voucher" }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit"), 10) || 10
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("query") || ""

  try {
    const { vouchers, total } = await getVouchersList(limit, page, query)

    return Response.json({ vouchers, total })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch vouchers",
      isError: true,
      technicalMessage: error.message,
    })

    return Response.json({ error: "Failed to fetch vouchers" }, { status: 500 })
  }
}
