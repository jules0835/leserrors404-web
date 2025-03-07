import { webAppSettings } from "@/assets/options/config"

export async function fetchProducts({ queryKey }) {
  const [, page, searchQuery] = queryKey
  const res = await fetch(
    `/api/shop/product?page=${page}&limit=${webAppSettings.shop.products.itemsPerPage}&q=${searchQuery || ""}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`/api/shop/product/${id}`)

  if (!res.ok) {
    throw new Error("Failed to fetch product")
  }

  return res.json()
}
