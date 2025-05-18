import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findAllUserInfosById, updateUserPassword } from "@/db/crud/userCrud"
import bcrypt from "bcryptjs"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"

export async function POST(req) {
  try {
    const userId = getReqUserId(req)
    const { currentPassword, newPassword } = await req.json()
    const t = await getTranslations("User.Security.Password")

    if (!userId || userId === "undefined") {
      log.userError({
        logKey: logKeys.loginFailed.key,
        message: "Unauthorized access attempt to change password",
        isError: true,
        data: { userId },
      })

      return NextResponse.json({ error: 401 }, { status: 401 })
    }

    const user = await findAllUserInfosById(userId)
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { error: t("currentPasswordIncorrect") },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updateUserPassword(userId, hashedPassword)

    log.userInfo({
      logKey: logKeys.userChangePassword.key,
      message: "User changed password",
      data: { userId },
      authorId: userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to change password",
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
