import { findShopProductById } from "@/db/crud/productCrud"

export async function GET(req, { params }) {
  const { Id } = await params

  try {
    const product = await findShopProductById(Id)

    if (!product) {
      return new Response("Product not found", { status: 404 })
    }

    return new Response(JSON.stringify(product), { status: 200 })
  } catch (error) {
    return new Response("Failed to fetch product", { status: 500 })
  }
}
