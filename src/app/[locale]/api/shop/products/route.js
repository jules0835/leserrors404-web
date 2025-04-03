import { getShopProducts } from "@/db/crud/productCrud"
import { logKeys, webAppSettings } from "@/assets/options/config"
import log from "@/lib/log"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit =
    parseInt(searchParams.get("limit"), 10) ||
    webAppSettings.shop.products.itemsPerPage
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("q") || ""
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const categories =
    searchParams.get("categories")?.split(",").filter(Boolean) || []
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
      categories,
      sort,
      availability,
      keywords,
      dateFrom,
      dateTo,
    })

    return new Response(JSON.stringify({ products: Products, total }), {
      status: 200,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopProductError.key,
      message: "Failed to fetch products",
      technicalMessage: error.message,
      data: {
        error,
      },
    })

    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    })
  }
}
