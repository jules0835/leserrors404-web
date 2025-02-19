import { getUsersList } from "@/features/admin/security/users/utils/users"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit"), 10) || 10
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("query") || ""

  try {
    const { users, total } = await getUsersList(limit, page, query)

    return Response.json({ users, total })
  } catch (error) {
    log.systemError({
      message: "Failed to fetch users",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
      isAdminAction: getReqIsAdmin(req),
    })

    return Response.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
