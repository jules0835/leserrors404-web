import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { NextResponse } from "next/server"
import { getOrdersByUserId } from "@/db/crud/orderCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const { searchParams } = req.nextUrl
    const limit = parseInt(searchParams.get("limit"), 10) || 10
    const page = parseInt(searchParams.get("page"), 10) || 1
    const sortField = searchParams.get("sortField") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const sort = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    }
    const { orders, total } = await getOrdersByUserId(userId, limit, page, sort)

    return NextResponse.json({ orders, total })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get orders",
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
