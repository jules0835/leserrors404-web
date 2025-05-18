export const runtime = "nodejs"

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { logEvent } from "@/lib/logEvent"
import { logKeys, tokenExpiration } from "@/assets/options/config"
import { SignJWT } from "jose"

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
        appMobileLogin: { label: "App Mobile Login", type: "checkbox" },
      },
      authorize: async (credentials) => {
        await logEvent({
          level: "userInfo",
          message: `User with email ${credentials.email} is attempting to log in`,
          logKey: logKeys.loginAttempt.key,
          data: { email: credentials.email },
        })

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/en/api/authentification/user`,
          {
            method: "POST",
            body: JSON.stringify({ credentials }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
            },
          }
        )

        if (!userResponse.ok) {
          const error = await userResponse.json()
          throw Error(error.error || "invalid_credentials")
        }

        const user = await userResponse.json()

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.userId = user._id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.image = user.image
        token.isAdmin = user.isAdmin
        token.keepLogin = account?.keepLogin || false
      }

      let expirationTime = 0

      if (token.isAdmin) {
        expirationTime = token.keepLogin
          ? tokenExpiration.admin.keepLogin
          : tokenExpiration.admin.default
      } else {
        expirationTime = token.keepLogin
          ? tokenExpiration.user.keepLogin
          : tokenExpiration.user.default
      }

      token.exp = Math.floor(Date.now() / 1000) + expirationTime

      if (user?.needsMobileToken) {
        const mobileTokenPayload = {
          userId: token.userId,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          isAdmin: token.isAdmin,
          exp: token.exp,
        }
        const mobileJwtSecret = new TextEncoder().encode(
          process.env.MOBILE_JWT_SECRET
        )

        token.tokenMobile = new SignJWT(mobileTokenPayload)
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(token.exp)
          .sign(mobileJwtSecret)
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
        session.user.exp = token.exp

        if (token.tokenMobile) {
          session.user.tokenMobile = token.tokenMobile
        }
      }

      return session
    },
  },
  csrf: true,
})
