import { logKeys } from "@/assets/options/config"
import {
  findChatByIdForChatBot,
  findChatByUserIdForChatBot,
  updateChatMessagesReadStatus,
} from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value
    let chat = null

    if (userId) {
      chat = await findChatByUserIdForChatBot(userId)
    } else if (chatId) {
      chat = await findChatByIdForChatBot(chatId)
    }

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    await updateChatMessagesReadStatus(chat._id)

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to mark messages as read",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
