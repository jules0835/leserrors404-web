/* eslint-disable no-case-declarations */
/* eslint-disable max-depth */
/* eslint-disable camelcase */
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import { NextResponse } from "next/server"
import { getOrderById } from "@/db/crud/orderCrud"
import { findUserById } from "@/db/crud/userCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import {
  cancelOrderWithRefund,
  cancelOrderWithoutRefund,
} from "@/features/shop/services/orderService"

export async function POST(req, { params }) {
  try {
    const { Id } = params
    const isAdmin = getReqIsAdmin(req)
    const userId = getReqUserId(req)
    const { action } = await req.json()

    if (!isAdmin) {
      log.systemSecurity({
        logKey: logKeys.internalError.key,
        message: "Unauthorized access to order",
        technicalMessage: "User is not an admin",
        data: { orderId: Id },
        isError: true,
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    const currentOrder = await getOrderById(Id)

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (
      currentOrder.orderStatus === "CANCEL" ||
      currentOrder.orderStatus === "REFUND"
    ) {
      return NextResponse.json(
        { error: "Order already canceled or refunded" },
        { status: 400 }
      )
    }

    const user = await findUserById(userId)
    const userFormated = `Admin - ${user.firstName} ${user.lastName} (${user._id})`

    if (action === "cancel_with_refund") {
      await cancelOrderWithRefund(
        Id,
        currentOrder.stripe.paymentIntentId,
        userFormated
      )

      return NextResponse.json({ message: "Order canceled successfully" })
    } else if (action === "cancel_without_refund") {
      await cancelOrderWithoutRefund(Id, userFormated)

      return NextResponse.json({ message: "Order canceled successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to cancel order",
      technicalMessage: error.message,
      data: { error },
      isError: true,
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
