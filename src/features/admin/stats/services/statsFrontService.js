export const getBasketsStats = async () => {
  const response = await fetch("/api/admin/stats/baskets")

  return response.json()
}

export const getCategoriesStats = async () => {
  const response = await fetch("/api/admin/stats/categories")

  return response.json()
}

export const getProductsStats = async () => {
  const response = await fetch(`/api/admin/stats/products`)

  if (!response.ok) {
    throw new Error("Failed to fetch products stats")
  }

  return response.json()
}

export const getSalesStats = async (queryParams) => {
  const response = await fetch(
    `/api/admin/stats/sales?page=${queryParams.page}&size=${queryParams.size}&groupBy=${queryParams.groupBy}&period=${queryParams.period}&productType=${queryParams.productType}&realTime=${queryParams.realTime}`
  )

  return response.json()
}

export const getTicketsStats = async (filters = {}) => {
  const response = await fetch(
    `/api/admin/stats/tickets?period=${filters.period || "7d"}&realTime=${filters.realTime || false}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch tickets stats")
  }

  return response.json()
}

export const getSubscriptionsStats = async (filters = {}) => {
  const response = await fetch(
    `/api/admin/stats/subscriptions?period=${filters.period || "7d"}&realTime=${filters.realTime || false}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions stats")
  }

  return response.json()
}

export const getCartStats = async (filters = {}) => {
  const response = await fetch(
    `/api/admin/stats/carts?period=${filters.period || "7d"}&realTime=${filters.realTime || false}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch cart stats")
  }

  return response.json()
}

export const formatCurrency = (value) => {
  if (value === undefined || value === null) {
    return "€ 0.00"
  }

  return `€ ${Number(value).toFixed(2)}`
}

export const formatDuration = (ms) => {
  if (!ms) {
    return "0s"
  }

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }

  return `${seconds}s`
}

export const formatDate = (hours, minutes, seconds) =>
  `${hours}h ${minutes}m ${seconds}s`
