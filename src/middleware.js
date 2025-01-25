import { NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { auth } from "@/auth"
import { routing } from "./i18n/routing"

// Middleware pour l'internationalisation
const intlMiddleware = createMiddleware(routing)
const protectedRoutes = ["/user", "/dashboard", "/settings", "/api"]
const unprotectedApiRoutes = ["/api/auth", "/admin", "/api/public"]
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
})

// Middleware combiné
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

// Configuration des routes protégées et internationales
export const config = {
  matcher: ["/user/:path*", "/", "/(fr|de|it|en|ts)/:path*", "/api/:path*"],
}
