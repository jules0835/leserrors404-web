import { NextResponse } from "next/server"
import { findSalesStats } from "@/features/admin/stats/services/statsBackService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)

    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const size = parseInt(searchParams.get("size"), 10) || 10
    const page = parseInt(searchParams.get("page"), 10) || 1
    const groupBy = searchParams.get("groupBy") || "day"
    const period = searchParams.get("period") || "7d"
    let productType = searchParams.get("productType") || null
    const realTime = searchParams.get("realTime") === "true"

    if (productType === "null") {
      productType = null
    }

    const stats = await findSalesStats({
      size,
      page,
      groupBy,
      period,
      productType,
      realTime,
    })

    return NextResponse.json(stats)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in sales stats route",
      technicalMessage: error.message,
      isError: true,
      data: {},
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
