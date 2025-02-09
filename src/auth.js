import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import log from "@/lib/log"

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
      },
      authorize: async (credentials) => {
        await log.userInfo({
          message: `User with email ${credentials.email} is attempting to log in`,
          logKey: "userLoginAttempt",
          data: { email: credentials.email },
        })

        const userResponse = await fetch(
          "http://localhost:3000/en/api/authentification/user",
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
          await log.userError({
            message: `User with email ${credentials.email} failed to log in`,
            logKey: "userLoginFailed",
            isError: true,
            data: { email: credentials.email },
          })
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          await log.userError({
            message: `User with email ${credentials.email} failed to log in`,
            logKey: "userLoginFailed",
            isError: true,
            userId: user._id,
            data: { email: credentials.email },
          })
          return null
        }

        await log.userInfo({
          message: `User with email ${credentials.email} successfully logged in`,
          logKey: "userLoginSuccess",
          userId: user._id,
          data: { email: credentials.email },
        })

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
