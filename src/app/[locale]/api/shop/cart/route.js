import { NextResponse } from "next/server"
import { createCart, findCart, mergeCart } from "@/db/crud/cartCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findUserById } from "@/db/crud/userCrud"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const cartId = req.cookies.get("cartId")?.value

    if (!cartId && !userId) {
      return NextResponse.json({
        error: "Cart not found",
        code: "CART_NOT_FOUND",
      })
    }

    let cart = await findCart(userId ? { user: userId } : { _id: cartId })

    if (!cart && userId) {
      const user = await findUserById(userId)
      cart = await createCart({
        user: userId,
        products: [],
        billingAddress: {
          name: `${user.firstName} ${user.lastName}`,
          country: user.address.country,
          city: user.address.city,
          zipCode: user.address.zipCode,
          street: user.address.street,
        },
      })
    }

    if (!cart) {
      return NextResponse.json({
        error: "Cart not found",
        code: "CART_NOT_FOUND",
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to get cart from GET /api/shop/cart",
      technicalMessage: error.message,
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const userId = getReqUserId(req)
    let billingAddress = null

    if (userId) {
      const user = await findUserById(userId)
      billingAddress = {
        name: `${user.firstName} ${user.lastName}`,
        country: user.address.country,
        city: user.address.city,
        zipCode: user.address.zipCode,
        street: user.address.street,
      }
    }

    const cart = await createCart({
      user: userId || null,
      products: [],
      billingAddress,
    })
    const response = NextResponse.json(cart)

    if (!userId) {
      response.cookies.set("cartId", cart._id.toString(), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return response
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to create cart from POST /api/shop/cart",
      technicalMessage: error.message,
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  const userId = getReqUserId(req)
  const tempCartId = req.cookies.get("cartId")?.value

  if (!userId || !tempCartId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }

  try {
    const mergedCart = await mergeCart(userId, tempCartId)
    const response = NextResponse.json(mergedCart)
    response.cookies.delete("cartId")

    return response
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to merge carts from PUT /api/shop/cart",
      technicalMessage: error.message,
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Failed to merge carts" },
      { status: 500 }
    )
  }
}
