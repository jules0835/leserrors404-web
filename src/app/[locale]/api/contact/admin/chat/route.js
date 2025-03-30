import { logKeys } from "@/assets/options/config"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"
import { findAdminChats, findAdminChatById } from "@/db/crud/chatCrud"

export async function GET(req) {
  try {
    const chats = await findAdminChats()

    return NextResponse.json({ chats })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to get admin chats",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { chatId } = await req.json()
    const chat = await findAdminChatById(chatId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.state !== "CHAT_ADMIN" && chat.state !== "INBOX") {
      return NextResponse.json(
        { error: "Chat is not in admin or inbox mode" },
        { status: 400 }
      )
    }

    return NextResponse.json({ chat })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to get admin chat",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
