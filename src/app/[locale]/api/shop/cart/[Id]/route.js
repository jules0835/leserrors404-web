import { NextResponse } from "next/server"
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCartProducts,
  updateBillingCycle,
} from "@/db/crud/cartCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req, { params }) {
  const { Id } = params
  const url = new URL(req.url)
  const action = url.searchParams.get("action")
  const productId = url.searchParams.get("productId")
  const quantity = parseInt(url.searchParams.get("quantity") || "1", 10)
  const billingCycle = url.searchParams.get("billingCycle")
  let result = null

  try {
    switch (action) {
      case "add":
        result = await addToCart(Id, productId, quantity, billingCycle)

        break

      case "remove":
        result = await removeFromCart(Id, productId)

        break

      case "update":
        result = await updateQuantity(Id, productId, quantity, billingCycle)

        break

      case "updateBillingCycle":
        result = await updateBillingCycle(Id, productId, billingCycle)

        break

      case "clear":
        result = await clearCartProducts(Id)

        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      message: "Failed to update cart on /api/shop/cart/[Id]",
      error,
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
