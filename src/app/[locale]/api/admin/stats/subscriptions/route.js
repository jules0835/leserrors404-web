import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findSubscriptionsStats } from "@/features/admin/stats/services/statsBackService"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "7d"
    const realTime = searchParams.get("realTime") === "true"
    const stats = await findSubscriptionsStats({ period, realTime })

    return NextResponse.json(stats)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in subscription stats route",
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
