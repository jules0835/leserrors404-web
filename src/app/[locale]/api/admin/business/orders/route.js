import { NextResponse } from "next/server"
import { getAllOrders } from "@/db/crud/orderCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { isValidObjectId } from "mongoose"

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl
    const limit = parseInt(searchParams.get("limit"), 10) || 10
    const page = parseInt(searchParams.get("page"), 10) || 1
    const sortField = searchParams.get("sortField") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const date = searchParams.get("date")
    const sort = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    }
    const filters = {}

    if (status && status !== "all") {
      filters.orderStatus = status
    }

    if (search) {
      if (isValidObjectId(search)) {
        filters._id = search
      } else {
        filters.$or = [
          { "user.firstName": { $regex: new RegExp(search, "iu") } },
          { "user.lastName": { $regex: new RegExp(search, "iu") } },
          { "user.email": { $regex: new RegExp(search, "iu") } },
          { "stripe.invoiceId": { $regex: new RegExp(search, "iu") } },
          { "stripe.sessionId": { $regex: new RegExp(search, "iu") } },
        ]
      }
    }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      filters.createdAt = { $gte: startDate, $lt: endDate }
    }

    const { orders, total } = await getAllOrders(limit, page, sort, filters)

    return NextResponse.json({ orders, total })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get admin orders",
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
