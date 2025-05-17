import {
  resetLoginAttempts,
  addLoginAttempt,
  changeActiveUserStatus,
  changeUserConfirmedStatus,
  findUserById,
  updateConfirmationToken,
  findUserByConfirmationToken,
  findUserByEmail,
  updateUserResetToken,
} from "@/db/crud/userCrud"
import log from "@/lib/log"
import { logKeys, webAppSettings } from "@/assets/options/config"
import { sendEmail } from "@/features/email/utils/emailService"
import { EmailTemplate } from "@/features/email/templates/main/emailTemplate"
import ConfirmTemplate from "@/features/email/templates/confirmTemplate"
import { getTranslations } from "next-intl/server"
import crypto from "crypto"
import ResetTemplate from "@/features/email/templates/resetTemplate"

export const handleLoginFailure = async (userId) => {
  try {
    await addLoginAttempt(userId)
    await checkLoginAttempts(userId)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to add login attempt",
      isError: true,
      userId,
      data: { userId, error },
    })
    throw new Error("Failed to add login attempt")
  }
}

export const handleLoginSuccess = async (userId) => {
  try {
    await resetLoginAttempts(userId)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to reset login attempts",
      isError: true,
      userId,
      data: { userId, error },
    })
    throw new Error("Failed to reset login attempts")
  }
}

export const checkLoginAttempts = async (userId) => {
  try {
    const user = await findUserById(userId)

    if (
      user.account.auth.loginAttempts >=
        webAppSettings.security.user.maxLoginAttemps &&
      user.account.activation.isActivated
    ) {
      await changeActiveUserStatus(
        user._id,
        false,
        "Account locked by system due to too many login attempts"
      )
      await changeUserConfirmedStatus(user._id, false)

      await log.userSecurity({
        logKey: logKeys.accountSecurityLock.key,
        message: "Account locked by system due to too many login attempts",
        isError: true,
        userId: user._id,
        data: { userId: user._id },
      })

      return false
    }

    return true
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to check login attempts",
      isError: true,
      userId,
      data: { userId, error },
    })
    throw new Error("Failed to check login attempts")
  }
}

export const sendConfirmationEmail = async (userId) => {
  const t = await getTranslations({ locale: "en" }, "Email")

  try {
    const user = await findUserById(userId)
    const now = new Date()
    const resendDelay = new Date(
      now.getTime() -
        webAppSettings.security.user.resendEmailDelayMinutes * 60000
    )

    if (
      user.account.confirmation.isConfirmed ||
      !user.account.activation.isActivated ||
      user.account.confirmation.lastSendTokenDate > resendDelay
    ) {
      return false
    }

    const token = generateConfirmationToken()
    const expiresToken = new Date(now.getTime() + 60 * 60000)

    try {
      await updateConfirmationToken(userId, token, expiresToken)
    } catch (error) {
      log.systemError({
        logKey: logKeys.internalError.key,
        message: "Failed to update confirmation token",
        isError: true,
        userId,
        data: { userId, error },
      })
      throw new Error("Failed to update confirmation token")
    }

    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/en/auth/confirm/email/${token}`
    const subject = t("Confirmation.subject")

    try {
      await sendEmail({
        to: user.email,
        subject,
        messageBody: (
          <EmailTemplate subject={subject} userName={user.firstName}>
            <ConfirmTemplate confirmUrl={confirmationLink} />
          </EmailTemplate>
        ),
      })
    } catch (error) {
      log.systemError({
        logKey: logKeys.internalError.key,
        message: "Failed to send confirmation email",
        isError: true,
        userId,
        data: { userId, error },
      })
      throw new Error("Failed to send confirmation email")
    }

    await log.userInfo({
      logKey: logKeys.userChangeConfirmation.key,
      message: "Confirmation email sent",
      userId,
      data: { userId },
    })

    return true
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to send confirmation email",
      isError: true,
      userId,
      data: { userId, error },
    })
    throw new Error("Failed to send confirmation email")
  }
}

export const confirmEmailWithToken = async (token) => {
  try {
    if (!token) {
      return false
    }

    const user = await findUserByConfirmationToken(token)

    if (
      !user ||
      user.account.confirmation.isConfirmed ||
      !user.account.activation.isActivated ||
      user.account.confirmation.expiresToken < new Date() ||
      user.account.confirmation.token !== token
    ) {
      log.systemSecurity({
        logKey: logKeys.userChangeConfirmation.key,
        message: "Failed to confirm email with token",
        isError: true,
        userId: user?._id,
        data: {
          token,
          userExists: Boolean(user),
          isConfirmed: user?.account.confirmation.isConfirmed,
          isActivated: user?.account.activation.isActivated,
          isTokenExpired: user?.account.confirmation.expiresToken < new Date(),
          isTokenMismatch: user?.account.confirmation.token !== token,
        },
      })

      return false
    }

    await changeUserConfirmedStatus(user._id, true)
    await updateConfirmationToken(user._id, null, null)

    await log.userInfo({
      logKey: logKeys.userChangeConfirmation.key,
      message: "User confirmed email",
      userId: user._id,
      data: { userId: user._id },
    })

    return true
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to confirm email with token",
      isError: true,
      data: { token, error },
    })

    return false
  }
}

export const sendResetPasswordEmail = async (email) => {
  const t = await getTranslations({ locale: "en" }, "Auth.ResetPasswordPage")

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      await log.userInfo({
        logKey: logKeys.userResetPassword.key,
        message: "Failed to send reset password email because user not found",
        isError: true,
        data: { email },
      })

      return { message: "If the email exists, a reset link has been sent." }
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000)

    await updateUserResetToken(user._id, token, expires)

    await sendEmail({
      to: user.email,
      subject: t("resetPasswordEmailSubject"),
      messageBody: (
        <EmailTemplate
          subject={t("resetPasswordEmailSubject")}
          userName={user.firstName}
        >
          <ResetTemplate
            resetUrl={`${process.env.NEXT_PUBLIC_APP_URL}/auth/password/${token}`}
          />
        </EmailTemplate>
      ),
    })

    await log.userInfo({
      logKey: logKeys.userResetPassword.key,
      message: "Reset password email sent",
      data: { email },
    })

    return { message: "Reset password email sent" }
  } catch (error) {
    await log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to send reset password email",
      isError: true,
      data: { email, error },
    })

    return { error: "Failed to send reset password email" }
  }
}

export const generateConfirmationToken = () =>
  crypto.randomBytes(20).toString("hex")
