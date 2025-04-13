import { getTicketsList } from "@/features/admin/support/service/tickets"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit"), 10) || 10
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("query") || ""
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  try {
    const { tickets, total } = await getTicketsList(
      limit,
      page,
      query,
      sortField,
      sortOrder
    )

    return Response.json({ tickets, total })
  } catch (error) {
    log.systemError({
      message: "Failed to fetch tickets",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
      isAdminAction: getReqIsAdmin(req),
    })

    return Response.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
