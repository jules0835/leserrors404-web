import { getCustomersList } from "@/features/admin/business/customers/utils/customers"
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
    const { customers, total } = await getCustomersList(
      limit,
      page,
      query,
      sortField,
      sortOrder
    )

    return Response.json({ customers, total })
  } catch (error) {
    log.systemError({
      message: "Failed to fetch customers",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
      isAdminAction: getReqIsAdmin(req),
    })

    return Response.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
