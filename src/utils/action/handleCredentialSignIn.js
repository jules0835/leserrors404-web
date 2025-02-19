"use server"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { getTranslations } from "next-intl/server"
import log from "@/lib/log"
import { company } from "@/assets/options/config"

export async function handleCredentialsSignin({
  email,
  password,
  otp,
  redirect,
}) {
  const t = await getTranslations("Auth.LoginPage")

  try {
    await signIn("credentials", {
      email,
      password,
      otp,
      redirectTo: redirect ? `${redirect}?reval=1` : "/?reval=1",
      callbackUrl: redirect ? `${redirect}?reval=1` : "/?reval=1",
    })

    return { message: "Sign in successful" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.cause.err.message) {
        case "invalid_credentials":
          return {
            error: t("invalidCredentials"),
          }

        case "account_inactive":
          return {
            error: t("accountInactive", { email: company.email }),
          }

        case "account_not_confirmed":
          return {
            error: t("accountNotConfirmed", { email: company.email }),
          }

        case "user_otp_required":
          return {
            otpRequired: true,
          }

        case "invalid_credentials_otp":
          return {
            error: t("invalidOtp"),
          }

        default:
          log.systemError({
            logKey: "systemError",
            message: "Unknown error in handleCredentialsSignin",
            ErrorMessage: error.message,
            data: { error, email },
          })

          return {
            error: t("unknownError"),
          }
      }
    }

    throw error
  }
}

export async function handleGithubSignin() {
  await signIn("github", { redirectTo: "/" })
}

export async function handleSignOut() {
  await signOut()
}
