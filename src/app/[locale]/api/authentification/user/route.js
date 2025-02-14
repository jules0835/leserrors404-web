import { findAuthUser } from "@/db/crud/userCrud"
import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { notFound } from "next/navigation"
import { returnReqParams } from "@/features/admin/security/logs/utils/logs"

export async function POST(req) {
  const requestBody = await req.json()
  const { credentials } = requestBody
  const authorizationHeader = req.headers.get("authorization")

  if (authorizationHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    log.systemSecurity({
      logKey: logKeys.internalCriticalSecurity.key,
      message:
        "Unauthorized request to get user data in /en/api/authentification/user",
      isError: true,
      data: { authorizationHeader },
    })

    return NextResponse.status(404)
  }

  const user = await findAuthUser(credentials.email)

  return NextResponse.json(user)
}

export function GET(req) {
  log.systemSecurity({
    logKey: logKeys.internalCriticalSecurity.key,
    message:
      "Unauthorized request to get user data in /en/api/authentification/user",
    isError: true,
    data: { reqParam: returnReqParams(req) },
  })

  return notFound()
}
