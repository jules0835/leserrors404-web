import { getShopProducts } from "@/db/crud/productCrud"
import { getCategories } from "@/db/crud/categorieCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""

  try {
    const { Products } = await getShopProducts({ query, size: 5, page: 1 })
    const { Categories } = await getCategories(3, 1, query)

    return new Response(
      JSON.stringify({ products: Products, categories: Categories }),
      {
        status: 200,
      }
    )
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopUserCartError.key,
      technicalMessage: error.message,
      message: "Failed to fetch search results for query",
      data: {
        query,
        error,
      },
      isError: true,
    })

    return new Response(
      JSON.stringify({ error: "Failed to fetch search results" }),
      {
        status: 500,
      }
    )
  }
}
