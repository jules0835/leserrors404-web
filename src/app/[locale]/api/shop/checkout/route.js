/* eslint-disable camelcase */
import { findUserById, updateUser } from "@/db/crud/userCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"
import { checkCartEligibilityForCheckout } from "@/db/crud/cartCrud"
import { getTranslations } from "next-intl/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(req, { params }) {
  const t = await getTranslations("Shop.Cart")
  const { searchParams } = req.nextUrl
  const saveCardForFuture = searchParams.get("saveCardForFuture") || false
  const isMobileApp = searchParams.get("appMobileCheckout") || false

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

    let user = await findUserById(userId)

    const billingAddress = cart.billingAddress || {
      name: `${user.firstName} ${user.lastName}`,
      country: user.address.country,
      city: user.address.city,
      zipCode: user.address.zipCode,
      street: user.address.street,
    }

    if (!user?.account?.stripe?.customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        address: {
          country: billingAddress.country,
          city: billingAddress.city,
          postal_code: billingAddress.zipCode,
          line1: billingAddress.street,
        },
        metadata: {
          userId: user._id.toString(),
        },
      })

      user = await updateUser(userId, {
        "account.stripe.customerId": customer.id,
      })

      log.systemInfo({
        logKey: logKeys.shopStripeCustomer.key,
        message: "Stripe customer created",
        newData: customer,
        oldData: user,
        authorId: userId,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: cart.products?.some((item) => item.product.subscription)
        ? "subscription"
        : "payment",
      customer: user?.account?.stripe?.customerId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/shop/checkout/redirect?session_id={CHECKOUT_SESSION_ID}&appMobileCheckout=${isMobileApp}`,
      cancel_url: isMobileApp
        ? `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/shop/checkout/redirect?isMobileFailed=true&appMobileCheckout=${isMobileApp}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/shop/cart`,
      discounts: cart.voucher?.stripeCouponId
        ? [{ promotion_code: cart.voucher.stripeCouponId }]
        : [],
      payment_intent_data:
        cart.products?.some((item) => item.product.subscription) ||
        !saveCardForFuture
          ? undefined
          : { setup_future_usage: "off_session" },
      line_items: cart.products?.map((item) => {
        let price = 0

        if (item.product.subscription) {
          price =
            item.billingCycle === "year"
              ? item.product.stripePriceIdAnnual
              : item.product.stripePriceIdMonthly
        } else {
          price = item.product.stripePriceId
        }

        return {
          price,
          quantity: item.quantity,
          tax_rates: item.product.stripeTaxId ? [item.product.stripeTaxId] : [],
        }
      }),
      invoice_creation: cart.products?.some((item) => item.product.subscription)
        ? undefined
        : {
            enabled: true,
          },
      locale,
    })

    log.systemInfo({
      logKey: logKeys.shopUserCart.key,
      message: "Checkout session created",
      data: session,
      authorId: userId,
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
      userId: getReqUserId(req),
      data: {
        error,
      },
      isError: true,
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
