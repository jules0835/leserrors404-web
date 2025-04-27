export const fetchProducts = async () => {
  const response = await fetch("/api/shop/suggestions")

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  const data = await response.json()

  return {
    products: data.products || [],
    subscriptionProducts: data.subscriptionProducts || [],
  }
}

export const fetchCategories = async () => {
  const response = await fetch("/api/shop/suggestions")

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  const data = await response.json()

  return data.categories || []
}
