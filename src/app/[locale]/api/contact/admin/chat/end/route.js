import { logKeys } from "@/assets/options/config"
import { endChat } from "@/db/crud/chatCrud"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const isAdmin = getReqIsAdmin(req)
    const { chatId } = await req.json()

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      )
    }

    const chat = await endChat(chatId)

    if (!chat.isActive) {
      return NextResponse.json({ success: true })
    }

    chat.isActive = false
    chat.closeBy = "ADMIN"
    chat.endedAt = new Date()
    await chat.save()

    log.systemInfo({
      logKey: logKeys.chatbotInfo.key,
      message: "Chat ended by admin",
      data: { chatId },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to end chat",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
