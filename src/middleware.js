import { NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { auth } from "@/auth"
import { routing } from "./i18n/routing"

// Middleware pour l'internationalisation
const intlMiddleware = createMiddleware(routing)
const protectedRoutes = ["/dashboard", "/api", "/admin"]
const unprotectedApiRoutes = ["/api/auth", "/api/public", "/api/auth/user"]
// eslint-disable-next-line consistent-return
const authMiddleware = auth((req) => {
  const currentPath = req.nextUrl.pathname
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en"

  if (!req.auth) {
    if (currentPath.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Access denied" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?next=${currentPath}`, req.url)
    )
  }

  if (currentPath.includes("/admin")) {
    if (!req.auth.user.isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }
  }

  if (currentPath.includes("/api/")) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
})

export default function middleware(req) {
  const currentPath = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) =>
    currentPath.includes(route)
  )
  const isUnprotectedApi = unprotectedApiRoutes.some((route) =>
    currentPath.startsWith(route)
  )

  if (isProtected && !isUnprotectedApi) {
    return authMiddleware(req)
  }

  if (currentPath.startsWith("/api")) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/user/:path*", "/", "/(fr|en|de|ts)/:path*", "/api/:path*"],
}
