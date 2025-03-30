/* eslint-disable max-depth */
/* eslint-disable prefer-destructuring */
import { logKeys } from "@/assets/options/config"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"
import {
  findAdminChats,
  findAdminChatById,
  addAdminMessage,
} from "@/db/crud/chatCrud"
import { sendAdminMessageEmail } from "@/features/admin/services/adminEmailService"

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
    const userId = getReqUserId(req)
    const {
      chatId,
      message,
      link,
      linkType,
      linkNeedLogin,
      isAction,
      action,
      sendAsEmail,
    } = await req.json()

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      )
    }

    if (message !== undefined) {
      const messageData = {
        message: message || "",
        sender: "ADMIN",
        sendDate: new Date(),
        readBy: [userId],
      }

      if (link && !message?.trim()) {
        return NextResponse.json(
          { error: "Message is required when sending a link" },
          { status: 400 }
        )
      }

      if (link) {
        messageData.link = link
        messageData.linkType = linkType
        messageData.linkNeedLogin = linkNeedLogin
      }

      if (isAction) {
        messageData.isAction = true
        messageData.action = action
        messageData.isActionDone = false
      }

      const chat = await addAdminMessage(chatId, messageData)

      if (sendAsEmail) {
        let emailAdrToSend = null
        let userName = null

        if (chat.user) {
          emailAdrToSend = chat.user.email
          userName = chat.user.firstName
        } else {
          emailAdrToSend = chat.email
          userName = chat.userName
        }

        await sendAdminMessageEmail(
          chatId,
          emailAdrToSend,
          userName,
          messageData.message,
          getReqUserId(req)
        )
      }

      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 })
      }

      if (!chat.isActive) {
        return NextResponse.json(
          { error: "Chat is not active" },
          { status: 400 }
        )
      }

      if (chat.state !== "CHAT_ADMIN") {
        return NextResponse.json(
          { error: "Chat is not in admin mode" },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })
    }

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
      message: "Failed to handle admin chat request",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
