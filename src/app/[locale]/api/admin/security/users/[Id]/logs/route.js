import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getUserLogs } from "@/db/crud/logCrud"

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const userId = params.Id

  try {
    const { logs, total } = await getUserLogs(userId, limit, page)

    return new Response(JSON.stringify({ logs, total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    log.systemError({
      message: "Failed to get user logs",
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
