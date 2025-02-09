import { getUsersList } from "@/features/admin/security/users/utils/users"

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit")) || 10
  const page = parseInt(searchParams.get("page")) || 1
  const query = searchParams.get("query") || ""

  try {
    const { users, total } = await getUsersList(limit, page, query)
    return Response.json({ users, total })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return Response.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
