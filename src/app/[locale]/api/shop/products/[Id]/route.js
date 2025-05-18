import { findShopProductById } from "@/db/crud/productCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  const { Id } = await params

  try {
    const product = await findShopProductById(Id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopProductError.key,
      message: "Failed to fetch product",
      technicalMessage: error.message,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
