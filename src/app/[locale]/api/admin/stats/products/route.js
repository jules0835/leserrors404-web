import { NextResponse } from "next/server"
import { findProductsStats } from "@/features/admin/stats/services/statsBackService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await findProductsStats()

    return NextResponse.json(stats)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in products stats route",
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
