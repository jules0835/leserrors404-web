import { NextResponse } from "next/server"
import { applyVoucherToCart, removeVoucherFromCart } from "@/db/crud/cartCrud"

export async function POST(req, { params }) {
  const { Id } = params
  const { code } = await req.json()

  try {
    const result = await applyVoucherToCart(Id, code)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { Id } = params

  try {
    const result = await removeVoucherFromCart(Id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
