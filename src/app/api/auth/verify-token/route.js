import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    const mobileJwtSecret = process.env.MOBILE_JWT_SECRET

    if (!mobileJwtSecret) {
      return NextResponse.json({ status: 500 })
    }

    const decoded = jwt.verify(token, mobileJwtSecret)

    return NextResponse.json({
      isValid: true,
      userId: decoded.userId,
      user: {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        isAdmin: decoded.isAdmin,
      },
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to verify token",
      technicalMessage: error.message,
      isError: true,
      data: { error },
    })

    return NextResponse.json(
      { error: "Token invalide", details: error.message },
      { status: 401 }
    )
  }
}
