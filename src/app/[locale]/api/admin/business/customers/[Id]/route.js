import { findUserForAdmin } from "@/db/crud/userCrud"
import { getOrdersByUserId } from "@/db/crud/orderCrud"
import { getSubscriptionsByUserId } from "@/db/crud/subscriptionCrud"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req, { params }) {
  const customerId = params.Id

  try {
    const { user } = await findUserForAdmin(customerId)

    if (!user) {
      log.systemError({
        logKey: logKeys.internalError.key,
        message: "Customer not found",
        data: { customerId },
        isAdminAction: getReqIsAdmin(req),
        authorId: getReqUserId(req),
        isError: true,
      })

      return Response.json({ error: "Customer not found" }, { status: 404 })
    }

    const [orders, subscriptions] = await Promise.all([
      getOrdersByUserId(customerId, 1000, 1),
      getSubscriptionsByUserId(customerId, 1000, 1),
    ])

    return Response.json({
      customer: user,
      orders: orders.orders,
      subscriptions: subscriptions.subscriptions,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get customer details",
      data: { customerId, error: error.message },
      isAdminAction: getReqIsAdmin(req),
      authorId: getReqUserId(req),
      isError: true,
    })

    return Response.json(
      { error: "Failed to get customer details" },
      { status: 500 }
    )
  }
}
