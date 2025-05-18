import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findCart, updateCartBillingAddress } from "@/db/crud/cartCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function PUT(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const { id } = params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const cart = await findCart(userId ? { user: userId } : { _id: id })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const updatedCart = await updateCartBillingAddress(cart._id, data)

    return NextResponse.json(updatedCart)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to update cart billing address",
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
