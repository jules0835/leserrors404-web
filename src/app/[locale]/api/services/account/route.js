import {
  handleLoginFailure,
  handleLoginSuccess,
  sendConfirmationEmail,
} from "@/features/auth/utils/accountService"
import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(req) {
  const authorizationHeader = req.headers.get("authorization")

  if (authorizationHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    log.systemSecurity({
      logKey: logKeys.internalCriticalSecurity.key,
      message: `Unauthorized request to account service at en/api/services/account`,
      isError: true,
      data: { authorizationHeader },
    })

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requestBody = await req.json()
  const { userId } = requestBody
  const { searchParams } = req.nextUrl
  const action = searchParams.get("action")

  try {
    if (action === "handleLoginFailure") {
      await handleLoginFailure(userId)
    } else if (action === "sendConfirmationEmail") {
      await sendConfirmationEmail(userId)
    } else if (action === "handleLoginSuccess") {
      await handleLoginSuccess(userId)
    } else {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: `Failed to process request at en/api/services/account`,
      isError: true,
      technicalMessage: error.message,
    })

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
