/* eslint-disable max-depth */
import { logKeys } from "@/assets/options/config"
import {
  findChatByIdForChatBot,
  findChatByUserIdForChatBot,
} from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"
import { botTreeMessages } from "@/features/contact/chatbot/assets/botTreeMessages"

export async function POST(req) {
  try {
    const t = await getTranslations("Contact.Chatbot")
    const userId = getReqUserId(req)
    const chatId = req.cookies.get("chatId")?.value
    const { message, isBotReply } = await req.json()

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

    if (isBotReply) {
      const lastBotMessage = [...chat.messages]
        .reverse()
        .find((msg) => msg.sender === "BOT" && msg.needUserSelectBot)

      let selectedOption = null
      let selectedQuestion = null
      let userMessageTransKey = null

      if (lastBotMessage) {
        if (
          lastBotMessage.botQuerySelectionOptions.some(
            (opt) => botTreeMessages[opt.value]
          )
        ) {
          selectedOption = botTreeMessages[message]
          userMessageTransKey = selectedOption?.transKey
        } else {
          const parentMessage = chat.messages.find(
            (msg) =>
              msg.sender === "BOT" &&
              msg.needUserSelectBot &&
              msg.botQuerySelectionOptions.some(
                (opt) => botTreeMessages[opt.value]?.questions?.[message]
              )
          )

          if (parentMessage) {
            const parentOption = parentMessage.botQuerySelectionOptions.find(
              (opt) => botTreeMessages[opt.value]?.questions?.[message]
            )

            if (parentOption) {
              selectedOption = botTreeMessages[parentOption.value]
              selectedQuestion = selectedOption.questions[message]
              userMessageTransKey = selectedQuestion?.transKey
            }
          }
        }
      }

      chat.messages.push({
        sender: "USER",
        message: userMessageTransKey ? t(userMessageTransKey) : message,
        isBotReply,
      })

      if (selectedOption) {
        if (selectedQuestion) {
          chat.messages.push({
            sender: "BOT",
            message: t(selectedQuestion.responseTransKey),
            needUserSelectBot: true,
            link: selectedQuestion.link?.href || null,
            linkType: selectedQuestion.link?.type || null,
            linkNeedLogin: selectedQuestion.link?.needLogin || false,
            action: selectedQuestion.action || null,
            readByUser: false,
            botQuerySelectionOptions: Object.entries(botTreeMessages).map(
              ([key, value]) => ({
                transKey: value.transKey,
                value: key,
              })
            ),
          })
        } else {
          chat.messages.push({
            sender: "BOT",
            message: t(selectedOption.questionTransKey),
            needUserSelectBot: true,
            link: selectedOption.link?.href || null,
            linkType: selectedOption.link?.type || null,
            action: selectedOption.action || null,
            linkNeedLogin: selectedOption.link?.needLogin || false,
            readByUser: false,
            botQuerySelectionOptions: Object.entries(
              selectedOption.questions
            ).map(([key, value]) => ({
              transKey: value.transKey,
              value: key,
            })),
          })
        }
      } else {
        chat.messages.push({
          sender: "BOT",
          message: t("bot.message.error"),
          needUserSelectBot: true,
          readByUser: false,
          botQuerySelectionOptions: Object.entries(botTreeMessages).map(
            ([key, value]) => ({
              transKey: value.transKey,
              value: key,
            })
          ),
        })
      }
    } else {
      chat.messages.push({
        sender: "USER",
        message,
        isBotReply,
      })
    }

    await chat.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to process bot message",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
