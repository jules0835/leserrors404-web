import { logKeys } from "@/assets/options/config"
import {
  findChatByIdForChatBot,
  findChatByUserIdForChatBot,
} from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function GET(req) {
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

    if (!chat.isActive) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.state !== "CHAT_ADMIN") {
      return NextResponse.json(
        { error: "Chat is not in admin mode" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, chat })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to get admin chat messages",
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
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value
    const { message } = await req.json()

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

    if (chat.state !== "CHAT_ADMIN") {
      return NextResponse.json(
        { error: "Chat is not in admin mode" },
        { status: 400 }
      )
    }

    chat.messages.push({
      sender: "USER",
      message,
      isBotReply: false,
      readByUser: false,
    })

    await chat.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to send admin message",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
