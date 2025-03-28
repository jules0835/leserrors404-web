import { logKeys } from "@/assets/options/config"
import {
  createChatForBotNoUser,
  createChatForBotUser,
  findChatByIdForBot,
  findChatByUserIdForBot,
} from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"
import { botTreeMessages } from "@/features/contact/chatbot/assets/botTreeMessages"
import { findUserById } from "@/db/crud/userCrud"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value
    let chat = null

    if (userId) {
      chat = await findChatByUserIdForBot(userId)
    } else if (chatId) {
      chat = await findChatByIdForBot(chatId)
    }

    if (chat) {
      return NextResponse.json({ chatState: "CHAT_EXIST", chat })
    }

    return NextResponse.json({ chatState: "NO_CHAT" })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to get chat from GET /api/contact/chatbot",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { chatState: "CHAT_ERROR", error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const t = await getTranslations("Contact.Chatbot")
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value

    if (chatId) {
      const chat = await findChatByIdForBot(chatId)

      if (chat) {
        return NextResponse.json(
          { chatState: "CHAT_EXIST", chatId: chat._id },
          { status: 200 }
        )
      }
    }

    const botQuerySelectionOptions = Object.entries(botTreeMessages).map(
      ([key, value]) => ({
        transKey: value.transKey,
        value: key,
      })
    )

    if (!userId) {
      const { userName, email } = await req.json()

      if (!userName || !email) {
        return NextResponse.json(
          {
            chatState: "CHAT_ERROR",
            error: t("error.userNameAndEmailRequired"),
          },
          { status: 400 }
        )
      }

      const message = {
        sender: "BOT",
        message: t("bot.message.hello", { userName }),
        needUserSelectBot: true,
        botQuerySelectionOptions,
      }
      const chat = await createChatForBotNoUser({ userName, email, message })

      return NextResponse.json({ chatId: chat._id }, { status: 200 })
    }

    const user = await findUserById(userId)
    const message = {
      sender: "BOT",
      message: t("bot.message.hello", { userName: user.firstName }),
      needUserSelectBot: true,
      botQuerySelectionOptions,
    }
    const chat = await createChatForBotUser({ userId, message })

    return NextResponse.json({ chatId: chat._id }, { status: 200 })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to create chat from POST /api/contact/chatbot",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { chatState: "CHAT_ERROR", error: error.message },
      { status: 500 }
    )
  }
}
