import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import { NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/db/crud/orderCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findUserById } from "@/db/crud/userCrud"

export async function GET(req, { params }) {
  try {
    const { Id } = await params
    const isAdmin = getReqIsAdmin(req)
    const order = await getOrderById(Id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!isAdmin) {
      log.systemSecurity({
        logKey: logKeys.internalError.key,
        message: "Unauthorized access to order",
        technicalMessage: "User is not an admin",
        data: {
          orderId: Id,
        },
        isError: true,
      })

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

export async function PUT(req, { params }) {
  try {
    const { Id } = params
    const isAdmin = getReqIsAdmin(req)
    const userId = getReqUserId(req)
    const { status, details } = await req.json()

    if (!isAdmin) {
      log.systemSecurity({
        logKey: logKeys.internalError.key,
        message: "Unauthorized access to order",
        technicalMessage: "User is not an admin",
        data: {
          orderId: Id,
        },
        isError: true,
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!status || !details) {
      return NextResponse.json(
        { error: "Status and details are required" },
        { status: 400 }
      )
    }

    const currentOrder = await getOrderById(Id)

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (currentOrder.orderStatus === status) {
      return NextResponse.json(
        { error: "Order already has this status" },
        { status: 400 }
      )
    }

    const user = await findUserById(userId)
    const userFormated = `Admin - ${user.firstName} ${user.lastName} (${user._id})`
    let message = ""

    switch (status) {
      case "PROCESSING":
        message = `Order passed to processing by admin. Details: ${details}`

        break

      case "COMPLETED":
        message = `Order completed by admin. Details: ${details}`

        break

      case "CANCEL":
        message = `Order canceled by admin. Details: ${details}`

        break

      case "REFUND":
        message = `Order refunded by admin. Details: ${details}`

        break

      case "PENDING":
        message = `Order suspended by admin. Details: ${details}`

        break
    }

    const updatedOrder = await updateOrderStatus(
      Id,
      status,
      message,
      userFormated
    )

    log.systemInfo({
      logKey: logKeys.orderUpdate.key,
      message: "Order status updated successfully",
      data: {
        orderId: Id,
        newStatus: status,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to update order status",
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
