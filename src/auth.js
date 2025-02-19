import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { logEvent } from "@/lib/logEvent"
import { logKeys, company } from "@/assets/options/config"
import * as OTPAuth from "otpauth"

// eslint-disable-next-line new-cap
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    // eslint-disable-next-line new-cap
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        keepLogin: { label: "Keep me logged in", type: "checkbox" },
      },
      authorize: async (credentials) => {
        await logEvent({
          level: "userInfo",
          message: `User with email ${credentials.email} is attempting to log in`,
          logKey: logKeys.loginAttempt.key,
          data: { email: credentials.email },
        })

        const userResponse = await fetch(
          `${process.env.SERVER_URL}/en/api/authentification/user`,
          {
            method: "POST",
            body: JSON.stringify({ credentials }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
            },
          }
        )
        const user = await userResponse.json()

        if (!user || !user.email) {
          await logEvent({
            level: "userError",
            message: `User with email ${credentials.email} failed to log in`,
            logKey: logKeys.loginFailed.key,
            isError: true,
            data: { email: credentials.email },
          })

          throw Error("invalid_credentials")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          await logEvent({
            level: "userError",
            message: `User with email ${credentials.email} failed to log in because of invalid password`,
            logKey: logKeys.loginFailed.key,
            isError: true,
            userId: user._id,
            data: { email: credentials.email },
          })

          await handleLoginFailure(user._id)

          throw Error("invalid_credentials")
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

          throw new Error("account_inactive")
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

          await sendConfirmationEmail(user._id)

          throw new Error("account_not_confirmed")
        }

        if (user.account.auth.isOtpEnabled) {
          if (!credentials.otp) {
            throw Error("user_otp_required")
          }

          const isValidOtp = verifyUserOtp(credentials.otp, user)

          if (!isValidOtp) {
            await logEvent({
              level: "userError",
              message: `User with email ${credentials.email} failed to log in because of invalid OTP`,
              logKey: logKeys.loginFailed.key,
              isError: true,
              userId: user._id,
              data: { email: credentials.email },
            })

            await handleLoginFailure(user._id)

            throw Error("invalid_credentials_otp")
          }
        }

        await logEvent({
          level: "userInfo",
          message: `User with email ${credentials.email} successfully logged in`,
          logKey: logKeys.loginSuccess.key,
          userId: user._id,
          data: { email: credentials.email },
        })

        await handleLoginSuccess(user._id)

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userId = user._id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.image = user.image
        token.isAdmin = user.isAdmin
      }

      return token
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.userId = token.userId
        session.user.id = token.id
        session.user.email = token.email
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.image = token.image
        session.user.isAdmin = token.isAdmin
      }

      return session
    },
  },
  csrf: true,
})
const handleLoginFailure = async (userId) => {
  await fetch(
    `${process.env.SERVER_URL}/en/api/services/account?action=handleLoginFailure`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
const handleLoginSuccess = async (userId) => {
  await fetch(
    `${process.env.SERVER_URL}/en/api/services/account?action=handleLoginSuccess`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
const sendConfirmationEmail = async (userId) => {
  await fetch(
    `${process.env.SERVER_URL}/en/api/services/account?action=sendConfirmationEmail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
const verifyUserOtp = (token, user) => {
  try {
    const username = `${user.firstName} ${user.lastName}`
    const userSecret = user.account.auth.otpSecret

    if (!username || !userSecret) {
      return { valid: false, message: "Invalid user data" }
    }

    const totp = new OTPAuth.TOTP({
      issuer: `${company.name}`,
      label: `${company.name} - ${username}`,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(userSecret),
    })
    const delta = totp.validate({ token, window: 1 })

    return delta !== null
  } catch (error) {
    return false
  }
}
