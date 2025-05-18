import { NextResponse } from "next/server"
import { findTicketsStats } from "@/features/admin/stats/services/statsBackService"
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
    const period = searchParams.get("period") || "7d"
    const realTime = searchParams.get("realTime") === "true"
    const stats = await findTicketsStats({ period, realTime })

    return NextResponse.json(stats)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in tickets stats route",
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
