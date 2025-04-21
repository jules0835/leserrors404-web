import { getShopProducts } from "@/db/crud/productCrud"
import { getActiveCategories } from "@/db/crud/categorieCrud"
import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET() {
  try {
    const { Products: products } = await getShopProducts({
      size: 9,
      page: 1,
      availability: "in-stock",
    })
    const { Categories: categories } = await getActiveCategories(3, 1)

    return NextResponse.json({
      products: products || [],
      categories: categories || [],
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to fetch suggestions",
      technicalMessage: error.message,
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    )
  }
}
