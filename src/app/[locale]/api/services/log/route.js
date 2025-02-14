import { createLog } from "@/db/crud/logCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { NextResponse } from "next/server"

export async function POST(req) {
  const authorizationHeader = req.headers.get("authorization")

  if (authorizationHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    log.systemSecurity({
      logKey: logKeys.internalCriticalSecurity.key,
      message: "Unauthorized request to log service in /en/api/services/log",
      isError: true,
      data: { authorizationHeader },
    })

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (req.method === "POST") {
    try {
      const newLog = await req.json()
      await createLog(newLog)

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      log.systemError({
        logKey: logKeys.internalError.key,
        message: "Failed to create log",
        isError: true,
        technicalMessage: error.message,
      })

      return NextResponse.json(
        { error: "Failed to create log" },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.status(404)
  }
}
