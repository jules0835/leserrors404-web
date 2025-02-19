import { NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { auth } from "@/auth"
import { routing } from "./i18n/routing"

// Middleware pour l'internationalisation
const intlMiddleware = createMiddleware(routing)
const protectedRoutes = ["/dashboard", "/api", "/admin", "/user"]
const unprotectedApiRoutes = [
  "/api/authentification",
  "/api/auth",
  "/api/public",
  "/en/api/authentification/user",
  "/en/api/services/log",
  "/en/api/services/account",
  "/api/test/email",
]
// eslint-disable-next-line consistent-return
const authMiddleware = auth((req) => {
  const currentPath = req.nextUrl.pathname
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en"

  if (!req.auth) {
    if (currentPath.includes("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Access denied" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?next=${currentPath}`, req.url)
    )
  }

  const { isAdmin, userId } = req.auth.user
  req.headers.set("x-int-auth-userId", userId)
  req.headers.set("x-int-auth-isAdmin", isAdmin)

  if (currentPath.includes("/admin")) {
    if (!req.auth.user.isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }
  }

  return intlMiddleware(req)
})

export default function middleware(req) {
  const currentPath = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) =>
    currentPath.includes(route)
  )
  const isUnprotectedApi = unprotectedApiRoutes.some((route) =>
    currentPath.includes(route)
  )
  const isAuthApi = currentPath.startsWith("/api/auth/")
  const isTestApi = currentPath.startsWith("/api/test/")

  if (isProtected && !isUnprotectedApi) {
    return authMiddleware(req)
  }

  if (isAuthApi || isTestApi) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/", "/(fr|en|de|ts)/:path*", "/api/:path*"],
}
