/* eslint-disable camelcase */
import { findUserById } from "@/db/crud/userCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"
import { checkCartEligibilityForCheckout } from "@/db/crud/cartCrud"
import { getTranslations } from "next-intl/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(req, { params }) {
  const t = await getTranslations("Shop.Cart")

  try {
    const userId = getReqUserId(req)
    const { locale } = params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { canCheckout, cart, reason } = await checkCartEligibilityForCheckout(
      null,
      {
        user: userId,
      }
    )

    if (!canCheckout) {
      return NextResponse.json(
        {
          message: t(reason),
          canCheckout: false,
        },
        { status: 400 }
      )
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const user = await findUserById(userId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: cart.products?.some((item) => item.product.subscription)
        ? "subscription"
        : "payment",
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/shop/checkout/redirect?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/shop/cart`,
      discounts: cart.voucher?.stripeCouponId
        ? [{ promotion_code: cart.voucher.stripeCouponId }]
        : [],
      line_items: cart.products?.map((item) => ({
        price: item.product.stripePriceId || item.product.stripePriceIdMonthly,
        quantity: item.quantity,
        tax_rates: item.product.stripeTaxId ? [item.product.stripeTaxId] : [],
      })),
    })

    log.systemInfo({
      logKey: logKeys.shopUserCart.key,
      message: "Checkout session created",
      data: session,
    })

    return NextResponse.json({
      url: session.url,
      canCheckout: true,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to checkout",
      technicalMessage: error,
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        canCheckout: false,
        message: t("failToCheckout"),
      },
      { status: 500 }
    )
  }
}
