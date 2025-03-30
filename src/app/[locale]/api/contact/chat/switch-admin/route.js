import { logKeys } from "@/assets/options/config"
import {
  findChatByIdForChatBot,
  findChatByUserIdForChatBot,
} from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const t = await getTranslations("Contact.Chatbot")
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

    if (!chat.isActive) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.state === "CHAT_ADMIN") {
      return NextResponse.json(
        { error: "Chat is already in admin mode" },
        { status: 400 }
      )
    }

    chat.messages.push({
      sender: "BOT",
      message: t("adminModeEnabled"),
      sendDate: new Date(),
    })

    chat.state = "CHAT_ADMIN"
    await chat.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to switch chat to admin mode",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
