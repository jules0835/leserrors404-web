import { getCartStats } from "@/db/crud/cartCrud"
import { getChatStats } from "@/db/crud/chatCrud"
import { getSalesStats } from "@/db/crud/orderCrud"
import { getProductStats, getCategoriesStats } from "@/db/crud/productCrud"
import { getSubscriptionStats } from "@/db/crud/subscriptionCrud"

export const findCartStats = async (params) => {
  const {
    size = 10,
    page = 1,
    groupBy = "day",
    period = "7d",
    category = null,
  } = params

  return await getCartStats({
    size,
    page,
    groupBy,
    period,
    category,
  })
}

export const findCategoriesStats = async () => await getCategoriesStats()

export const findProductsStats = async () => await getProductStats()

export const findSalesStats = async (params) => {
  const {
    size = 10,
    page = 1,
    groupBy = "day",
    period = "7d",
    productType = null,
    realTime = false,
  } = params

  return await getSalesStats({
    size,
    page,
    groupBy,
    period,
    productType,
    realTime,
  })
}

export const findTicketsStats = async (params) => await getChatStats(params)

export const findSubscriptionsStats = async (params) =>
  await getSubscriptionStats(params)
