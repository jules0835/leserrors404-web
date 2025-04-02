import { NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { auth } from "@/auth"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)
const protectedRoutes = ["/dashboard", "/api", "/admin", "/user"]
const unprotectedApiRoutes = [
  "/api/authentification",
  "/api/auth",
  "/api/public",
  "/en/api/authentification/user",
  "/en/api/services/log",
  "/en/api/services/account",
  "/api/stripe/webhook/order",
  "/api/stripe/webhook/subscription",
]

function checkTokenExpiration(req) {
  const userExp = req?.auth?.expires

  if (!userExp) {
    return false
  }

  const expirationTime = new Date(userExp).getTime() / 1000
  const currentTime = Math.floor(Date.now() / 1000)

  return expirationTime > currentTime
}

async function verifyMobileToken(token) {
  try {
    if (!token) {
      return { isValid: false, error: "Missing token" }
    }

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/verify-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()

      return { isValid: false, error: errorData.error || "Invalid token" }
    }

    const data = await response.json()

    return {
      isValid: data.isValid,
      userIdMobile: data.userId,
      isAdminMobile: data.isAdmin || false,
    }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}

function extractBearerToken(req) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  return authHeader.split(" ")[1]
}

const authMiddleware = auth(async (req) => {
  const currentPath = req.nextUrl.pathname
  const locale = req.cookies.get("NEXT_LOCALE")?.value || "en"
  const isShopApi = currentPath.includes("/api/shop/")
  const isContactApi = currentPath.includes("/api/contact/chat")
  const mobileToken = extractBearerToken(req)

  if (currentPath.includes("/api/") && !currentPath.includes("/api/auth/")) {
    if (mobileToken) {
      const mobileAuth = await verifyMobileToken(mobileToken)

      if (mobileAuth.isValid) {
        req.auth = {
          ...req.auth,
          user: {
            ...req.auth?.user,
            userId: mobileAuth.userIdMobile,
            isAdmin: mobileAuth.isAdminMobile,
          },
        }
      } else {
        return new NextResponse(
          JSON.stringify({ error: "Invalid mobile token" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        )
      }
    }
  }

  const { isAdmin, userId } = req?.auth?.user || {}

  if (userId) {
    req.headers.set("x-int-auth-userId", userId)
    req.headers.set("x-int-auth-isAdmin", isAdmin)
  }

  if (isShopApi || isContactApi) {
    return intlMiddleware(req)
  }

  if (!req.auth && !mobileToken) {
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

  if (!checkTokenExpiration(req) && !mobileToken) {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/logout?next=${currentPath}`, req.url)
    )
  }

  if (currentPath.includes("/admin")) {
    if (!isAdmin) {
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
  const isStripeWebhookApi = currentPath.startsWith("/api/stripe/webhook/")

  if (isProtected && !isUnprotectedApi) {
    return authMiddleware(req)
  }

  if (isAuthApi || isStripeWebhookApi) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [
    "/",
    "/(fr|en|de|ts)/:path*",
    "/api/:path*",
    "/auth/:path*",
    "/admin/:path*",
  ],
}
