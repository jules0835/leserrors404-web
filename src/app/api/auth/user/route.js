import { findAuthUser } from "@/db/crud/userCrud"
import { NextResponse } from "next/server"

export async function POST(req) {
  const requestBody = await req.json()
  const { credentials } = requestBody
  const user = await findAuthUser(credentials.email)

  return NextResponse.json(user)
}
