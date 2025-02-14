import { getLogs } from "@/db/crud/logCrud"
import log from "@/lib/log"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
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

    return new Response(JSON.stringify({ logs, total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    log.systemError({
      message: "Failed to get logs",
      logKey: logKeys.systemError.key,
      isError: true,
      technicalMessage: { error: error.message },
    })

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
