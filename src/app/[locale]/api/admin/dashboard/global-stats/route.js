import { NextResponse } from "next/server"
import { getDashboardStats } from "@/features/admin/dashboard/service/adminDashboard"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const isAdmin = getReqIsAdmin(req)

    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getDashboardStats()

    return NextResponse.json(stats)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in dashboard global stats route",
      technicalMessage: error.message,
      isError: true,
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
