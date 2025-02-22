import { NextResponse } from "next/server"
import { findUserByEmail, updateUserResetToken } from "@/db/crud/userCrud"
import { sendResetPasswordEmail } from "@/features/auth/utils/accountService"
import crypto from "crypto"
import { getTranslations } from "next-intl/server"
import { log } from "console"
import { logKeys } from "@/assets/options/config"

export async function POST(req) {
  const t = await getTranslations("Auth.ResetPasswordPage")

  try {
    const { email } = await req.json()
    const user = await findUserByEmail(email)

    if (user) {
      const token = crypto.randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 3600000)
      await updateUserResetToken(user._id, token, expires)
      await sendResetPasswordEmail(user.email, token)
    }

    await log.userInfo({
      logKey: logKeys.userResetPassword.key,
      message: "Reset password email sent",
      data: { email },
    })

    return NextResponse.json({
      message: t("resetPasswordEmailSent"),
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to send reset password email",
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "InternalServerError", message: t("somethingWentWrong") },
      { status: 500 }
    )
  }
}
