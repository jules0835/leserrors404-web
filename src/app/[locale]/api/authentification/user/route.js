import { findAuthUser } from "@/db/crud/userCrud"
import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { notFound } from "next/navigation"
import { returnReqParams } from "@/features/admin/security/logs/utils/logs"
import bcrypt from "bcryptjs"
import {
  handleAuthLoginFailure,
  handleAuthLoginSuccess,
  sendAuthConfirmationEmail,
  verifyAuthUserOtp,
} from "@/features/auth/utils/loginUtils"
import { logEvent } from "@/lib/logEvent"

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

  if (!user || !user.email) {
    await logEvent({
      level: "userError",
      message: `User with email ${credentials.email} failed to log in`,
      logKey: logKeys.loginFailed.key,
      isError: true,
      data: { email: credentials.email },
    })

    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(credentials.password, user.password)

  if (!isValid) {
    await logEvent({
      level: "userError",
      message: `User with email ${credentials.email} failed to log in because of invalid password`,
      logKey: logKeys.loginFailed.key,
      isError: true,
      userId: user._id,
      data: { email: credentials.email },
    })

    await handleAuthLoginFailure(user._id)

    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  if (!user.account.activation.isActivated) {
    await logEvent({
      level: "userError",
      message: `User with email ${credentials.email} failed to log in because account is not activated`,
      logKey: logKeys.loginFailed.key,
      isError: true,
      userId: user._id,
      data: { email: credentials.email },
    })

    return NextResponse.json({ error: "account_inactive" }, { status: 401 })
  }

  if (!user.account.confirmation.isConfirmed) {
    await logEvent({
      level: "userError",
      message: `User with email ${credentials.email} failed to log in because account is not confirmed`,
      logKey: logKeys.loginFailed.key,
      isError: true,
      userId: user._id,
      data: { email: credentials.email },
    })

    await sendAuthConfirmationEmail(user._id)

    return NextResponse.json(
      { error: "account_not_confirmed" },
      { status: 401 }
    )
  }

  if (user.account.auth.isOtpEnabled) {
    if (!credentials.otp) {
      return NextResponse.json({ error: "user_otp_required" }, { status: 401 })
    }

    const isValidOtp = verifyAuthUserOtp(credentials.otp, user)

    if (!isValidOtp) {
      await logEvent({
        level: "userError",
        message: `User with email ${credentials.email} failed to log in because of invalid OTP`,
        logKey: logKeys.loginFailed.key,
        isError: true,
        userId: user._id,
        data: { email: credentials.email },
      })

      await handleAuthLoginFailure(user._id)

      return NextResponse.json(
        { error: "invalid_credentials_otp" },
        { status: 401 }
      )
    }
  }

  await logEvent({
    level: "userInfo",
    message: `User with email ${credentials.email} successfully logged in`,
    logKey: logKeys.loginSuccess.key,
    userId: user._id,
    data: { email: credentials.email },
  })

  await handleAuthLoginSuccess(user._id)

  if (credentials.appMobileLogin) {
    user.needsMobileToken = true
  }

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
