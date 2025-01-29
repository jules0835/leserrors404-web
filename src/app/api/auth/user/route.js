import { findAuthUser } from "@/db/crud/userCrud"
import { NextResponse } from "next/server"

export async function POST(req) {
  const requestBody = await req.json()
  const { credentials } = requestBody
  const authorizationHeader = req.headers.get("authorization")

  if (authorizationHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await findAuthUser(credentials.email)

  return NextResponse.json(user)
}
