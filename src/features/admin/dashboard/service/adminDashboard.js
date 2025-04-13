import { getTodayOrdersCount } from "@/db/crud/orderCrud"
import { getTodayRegistrationsCount } from "@/db/crud/userCrud"
import { getTodayOpenTicketsCount } from "@/db/crud/chatCrud"
import { getActiveSubscriptionsCount } from "@/db/crud/subscriptionCrud"

export const getDashboardStats = async () => {
  const [
    todayOrders,
    todayRegistrations,
    todayOpenTickets,
    activeSubscriptions,
  ] = await Promise.all([
    getTodayOrdersCount(),
    getTodayRegistrationsCount(),
    getTodayOpenTicketsCount(),
    getActiveSubscriptionsCount(),
  ])

  return {
    todayOrders,
    todayRegistrations,
    todayOpenTickets,
    activeSubscriptions,
  }
}
