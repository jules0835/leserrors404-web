/* eslint-disable max-params */
import { getUsers } from "@/db/crud/userCrud"
import { getAllOrders } from "@/db/crud/orderCrud"
import { getAllSubscriptions } from "@/db/crud/subscriptionCrud"

export async function getCustomersList(
  size = 10,
  page = 1,
  query = "",
  sortField = "createdAt",
  sortOrder = "desc"
) {
  try {
    const searchQuery = query
      ? {
          $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { phone: { $regex: query, $options: "i" } },
          ],
        }
      : {}
    const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 }
    const { users, total } = await getUsers(size, page, searchQuery, sort)
    const userIds = users.map((user) => user._id)
    const [orders, subscriptions] = await Promise.all([
      getAllOrders(1000, 1, {}, { user: { $in: userIds } }),
      getAllSubscriptions(1000, 1, {}, { user: { $in: userIds } }),
    ])
    const orderCounts = {}
    const subscriptionCounts = {}

    orders.orders.forEach((order) => {
      orderCounts[order.user._id] = (orderCounts[order.user._id] || 0) + 1
    })

    subscriptions.subscriptions.forEach((subscription) => {
      if (subscription.stripe.status === "active") {
        subscriptionCounts[subscription.user._id] =
          (subscriptionCounts[subscription.user._id] || 0) + 1
      }
    })

    const customers = users.map((user) => ({
      ...user.toObject(),
      orderCount: orderCounts[user._id] || 0,
      activeSubscriptionCount: subscriptionCounts[user._id] || 0,
    }))

    return { customers, total }
  } catch (error) {
    return { customers: [], total: 0 }
  }
}
