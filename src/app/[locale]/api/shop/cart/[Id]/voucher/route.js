import { NextResponse } from "next/server"
import { applyVoucherToCart, removeVoucherFromCart } from "@/db/crud/cartCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(req, { params }) {
  const { Id } = params
  const { code } = await req.json()

  try {
    const result = await applyVoucherToCart(Id, code)

    return NextResponse.json(result)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to apply voucher to cart",
      error,
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { Id } = params

  try {
    const result = await removeVoucherFromCart(Id)

    return NextResponse.json(result)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to remove voucher from cart",
      error,
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
