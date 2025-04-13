import { logKeys } from "@/assets/options/config"
import { getTicketsList } from "@/features/admin/support/service/tickets"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"

export async function GET(req) {
  try {
    const isAdmin = getReqIsAdmin(req)
    const userId = getReqUserId(req)

    if (!isAdmin || !userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tickets } = await getTicketsList(7, 1, "", "createdAt", "desc")

    return Response.json({ tickets })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch latest tickets",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
      isAdminAction: getReqIsAdmin(req),
    })

    return Response.json(
      { error: "Failed to fetch latest tickets" },
      { status: 500 }
    )
  }
}
