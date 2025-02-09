"use server"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { getTranslations } from "next-intl/server"
import log from "@/lib/log"

export async function handleCredentialsSignin({ email, password, redirect }) {
  const t = await getTranslations("Auth.LoginPage")
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: `${redirect}?reval=1` || "/?reval=1",
      callbackUrl: `${redirect}?reval=1` || "/?reval=1",
    })

    if (result?.error) {
      return { error: t("invalidCredentials") }
    }

    return { message: "Sign in successful" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: t("invalidCredentials"),
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
