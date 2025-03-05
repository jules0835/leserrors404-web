import { getShopProducts } from "@/db/crud/productCrud"
import { getCategories } from "@/db/crud/categorieCrud"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""

  try {
    const { Products } = await getShopProducts(query, 5, 1)
    const { Categories } = await getCategories(3, 1, query)

    return new Response(
      JSON.stringify({ products: Products, categories: Categories }),
      {
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch search results" }),
      {
        status: 500,
      }
    )
  }
}
