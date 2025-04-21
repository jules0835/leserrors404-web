import { getShopProducts } from "@/db/crud/productCrud"
import { logKeys, webAppSettings } from "@/assets/options/config"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit =
    parseInt(searchParams.get("limit"), 10) ||
    webAppSettings.shop.products.itemsPerPage
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("q") || ""
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const category = searchParams.get("categories") || ""
  const sort = searchParams.get("sort")
  const availability = searchParams.get("availability")
  const keywords = searchParams.get("keywords")
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")

  try {
    const { Products, total } = await getShopProducts({
      query,
      limit,
      page,
      minPrice,
      maxPrice,
      category,
      sort,
      availability,
      keywords,
      dateFrom,
      dateTo,
    })

    return NextResponse.json({ products: Products, total })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopProductError.key,
      message: "Failed to fetch products",
      technicalMessage: error.message,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
