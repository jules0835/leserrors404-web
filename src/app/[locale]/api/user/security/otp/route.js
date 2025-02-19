import {
  changeStatusUserOtp,
  findUserById,
  getUserOtpDetails,
} from "@/db/crud/userCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import {
  getUserNewOtpKey,
  verifyUserOtp,
} from "@/features/auth/utils/otpService"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId || userId === "undefined") {
      log.userError({
        logKey: logKeys.loginFailed.key,
        message: "Unauthorized access attempt to GET OTP",
        isError: true,
        data: { userId },
      })
      return NextResponse.json({ error: 401 }, { status: 401 })
    }

    const { isOtpEnabled } = await getUserOtpDetails(userId)

    return NextResponse.json({ isOtpEnabled })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to process GET OTP request",
      isError: true,
      authorId: getReqUserId(req),
      technicalMessage: error.message,
    })
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId || userId === "undefined") {
      log.userError({
        logKey: logKeys.loginFailed.key,
        message: "Unauthorized access attempt to POST OTP",
        isError: true,
        data: { userId },
      })
      return NextResponse.json({ error: 401 }, { status: 401 })
    }

    const { secret, qrCodeUrl } = await getUserNewOtpKey(userId)

    log.userInfo({
      logKey: logKeys.userChangeStatus.key,
      message: "User requested new OTP key",
      data: { userId },
      authorId: userId,
    })

    return NextResponse.json({ secret, qrCodeUrl })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to process POST OTP request",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
    })
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const t = await getTranslations("User.Security.OtpConfig")
    const userId = getReqUserId(req)
    const requestBody = await req.json()
    const { token } = requestBody

    if (!userId || userId === "undefined") {
      log.userError({
        logKey: logKeys.loginFailed.key,
        message: "Unauthorized access attempt to PUT OTP",
        isError: true,
        data: { userId },
        authorId: userId,
      })
      return NextResponse.json({ error: 401 }, { status: 401 })
    }

    const user = await findUserById(userId)
    const isOtpValid = await verifyUserOtp(token, user)

    if (!isOtpValid) {
      return NextResponse.json(
        { isOtpValid, success: false, error: t("invalidOtp") },
        { status: 200 }
      )
    }

    await changeStatusUserOtp(userId, true)

    log.userInfo({
      logKey: logKeys.userChangeStatus.key,
      message: "User enabled OTP",
      data: { userId },
      authorId: userId,
    })

    return NextResponse.json({ isOtpValid, success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to process PUT OTP request",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
    })
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId || userId === "undefined") {
      log.userError({
        logKey: logKeys.loginFailed.key,
        message: "Unauthorized access attempt to DELETE OTP",
        isError: true,
        authorId: userId,
        data: { userId },
      })
      return NextResponse.json({ error: 401 }, { status: 401 })
    }

    await changeStatusUserOtp(userId, false)

    log.userInfo({
      logKey: logKeys.userChangeStatus.key,
      message: "User disabled OTP",
      data: { userId },
      authorId: userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to process DELETE OTP request",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
    })
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
