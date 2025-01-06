import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { findAuthUser } from "@/db/crud/userCrud"

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
        const user = await findAuthUser(credentials.email)

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          return null
        }

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
      }

      return token
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
      }

      return session
    },
  },
  csrf: true,
})
