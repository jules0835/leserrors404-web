import { getShopProducts } from "@/db/crud/productCrud"
import { webAppSettings } from "@/assets/options/config"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit =
    parseInt(searchParams.get("limit"), 10) ||
    webAppSettings.products.itemsPerPage
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("q") || ""

  try {
    const { Products, total } = await getShopProducts(query, limit, page)

    return new Response(JSON.stringify({ products: Products, total }), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    })
  }
}
