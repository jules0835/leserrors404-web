import { NextResponse } from "next/server"
import { getOrdersByUserId } from "@/db/crud/orderCrud"
import { getSubscriptionsByUserId } from "@/db/crud/subscriptionCrud"
import { findUserChats } from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      )
    }

    const [orders, subscriptions, tickets] = await Promise.all([
      getOrdersByUserId(userId, 5),
      getSubscriptionsByUserId(userId, 5),
      findUserChats(userId),
    ])
    const stats = {
      totalOrders: orders.orders.length,
      activeSubscriptions: subscriptions.subscriptions.filter(
        (sub) => sub.stripe.status === "active"
      ).length,
      activeTickets: tickets.filter((ticket) => ticket.isActive).length,
      totalSpent: orders.orders.reduce(
        (sum, order) => sum + order.stripe.amountTotal / 100,
        0
      ),
    }

    return NextResponse.json({
      orders: orders.orders,
      subscriptions: subscriptions.subscriptions,
      tickets: tickets.filter((ticket) => ticket.isActive),
      stats,
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in user dashboard route",
      technicalMessage: error.message,
      isError: true,
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    )
  }
}
