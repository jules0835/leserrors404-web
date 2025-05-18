export const fetchProducts = async ({
  page = 1,
  searchQuery = "",
  minPrice,
  maxPrice,
  categories,
  sort,
  availability,
  keywords,
  dateFrom,
  dateTo,
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(searchQuery && { q: searchQuery }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(categories && { categories }),
    ...(sort && { sort }),
    ...(availability && { availability }),
    ...(keywords && { keywords }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  })
  const response = await fetch(`/api/shop/products?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export const fetchCategories = async () => {
  const response = await fetch("/api/shop/categories")

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`/api/shop/products/${id}`)

  if (!res.ok) {
    throw new Error("Failed to fetch product")
  }

  return res.json()
}
