import { NextResponse } from "next/server"
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCartProducts,
} from "@/db/crud/cartCrud"

// /shop/cart/[Id]

export async function GET(req, { params }) {
  const { Id } = params
  const url = new URL(req.url)
  const action = url.searchParams.get("action")
  const productId = url.searchParams.get("productId")
  const quantity = parseInt(url.searchParams.get("quantity") || "1", 10)
  let result = null

  try {
    switch (action) {
      case "add":
        result = await addToCart(Id, productId, quantity)

        break

      case "remove":
        result = await removeFromCart(Id, productId)

        break

      case "update":
        result = await updateQuantity(Id, productId, quantity)

        break

      case "clear":
        result = await clearCartProducts(Id)

        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
