import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import { NextResponse } from "next/server"
import { getOrderById } from "@/db/crud/orderCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req, { params }) {
  try {
    const { Id } = await params
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)
    const order = await getOrderById(Id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!isAdmin && order.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get order by id",
      technicalMessage: error.message,
      data: {
        error,
      },
      isError: true,
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
