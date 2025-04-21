import { getLogs } from "@/db/crud/logCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  let page = parseInt(searchParams.get("page") || "1", 10)
  const query = searchParams.get("query") || ""
  const sortField = searchParams.get("sortField") || "date"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const filter = searchParams.get("filter") || ""
  const logKeys = searchParams.get("logKeys")
    ? searchParams.get("logKeys").split(",")
    : []
  const date = searchParams.get("date") || ""

  page = page < 1 ? 1 : page

  try {
    const { logs, total } = await getLogs(
      limit,
      page,
      query,
      sortField,
      sortOrder,
      filter,
      date,
      logKeys
    )

    return NextResponse.json({ logs, total })
  } catch (error) {
    log.systemError({
      message: "Failed to get logs",
      logKey: logKeys.systemError.key,
      isError: true,
      technicalMessage: { error: error.message },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
