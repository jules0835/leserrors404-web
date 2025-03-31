import { logKeys } from "@/assets/options/config"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"
import {
  findChatByIdForChatBot,
  findChatByUserIdForChatBot,
  markUserMessagesAsRead,
} from "@/db/crud/chatCrud"

export async function POST(req) {
  try {
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value
    const { isTyping } = await req.json()
    let chat = null

    if (userId) {
      chat = await findChatByUserIdForChatBot(userId)
    } else if (chatId) {
      chat = await findChatByIdForChatBot(chatId)
    }

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (
      chat.state !== "CHAT_ADMIN" &&
      chat.state !== "INBOX" &&
      !chat.isActive
    ) {
      return NextResponse.json(
        { error: "Chat not available for typing" },
        { status: 404 }
      )
    }

    chat = await markUserMessagesAsRead(chat._id, isTyping)

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to update user typing status",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
