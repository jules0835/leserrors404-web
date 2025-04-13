import { NextResponse } from "next/server"
import { getLogs } from "@/db/crud/logCrud"
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

    const { logs } = await getLogs(5, 1, "", "date", "desc", "", "", [])

    return NextResponse.json({ logs })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Error in dashboard latest logs route",
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
