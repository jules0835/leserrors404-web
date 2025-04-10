import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findAdminChatById } from "@/db/crud/chatCrud"

export async function GET(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const chatId = params.Id
    const chat = await findAdminChatById(chatId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to fetch chat",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
