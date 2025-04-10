import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { findAdminChatById, addMessageToChat } from "@/db/crud/chatCrud"

export async function POST(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const chatId = params.Id
    const { message } = await req.json()
    const chat = await findAdminChatById(chatId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedChat = await addMessageToChat(chatId, {
      sender: "USER",
      message,
      isBotReply: false,
      readByUser: false,
    })

    if (!updatedChat) {
      return NextResponse.json(
        { error: "Failed to add message to chat" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to send message",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
