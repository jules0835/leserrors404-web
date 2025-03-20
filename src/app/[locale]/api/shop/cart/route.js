import { NextResponse } from "next/server"
import { createCart, findCart, mergeCart } from "@/db/crud/cartCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const cartId = req.cookies.get("cartId")?.value

    if (!cartId && !userId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    let cart = await findCart(userId ? { user: userId } : { _id: cartId })

    if (!cart && userId) {
      cart = await createCart({ user: userId, products: [] })
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
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
    const cart = await createCart({
      user: userId || null,
      products: [],
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
