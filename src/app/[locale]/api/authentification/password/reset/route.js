import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import {
  findUserByResetToken,
  updateUserPassword,
  updateUserResetToken,
} from "@/db/crud/userCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getTranslations } from "next-intl/server"

export async function POST(req) {
  const t = await getTranslations("Auth.ResetPasswordPage")

  try {
    const { token, password } = await req.json()
    const user = await findUserByResetToken(token)

    if (!user || user.account.resetPassword.expires < new Date()) {
      await log.userInfo({
        logKey: logKeys.userResetPassword.key,
        message: "User reset password failed",
        data: { token, password, user },
      })

      return NextResponse.json(
        {
          error: "InvalidOrExpiredToken",
          message: t("invalidOrExpiredToken"),
        },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await updateUserPassword(user._id, hashedPassword)
    await updateUserResetToken(user._id, null, null)

    await log.userInfo({
      logKey: logKeys.userResetPassword.key,
      message: "User reset password",
      userId: user._id,
      data: { userId: user._id },
    })

    return NextResponse.json({
      message: t("passwordResetSuccess"),
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to reset password",
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
