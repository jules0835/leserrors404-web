import { logKeys } from "@/assets/options/config"
import { ChatModel } from "@/db/models/ChatModel"
import { mwdb } from "@/api/mwdb"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    await mwdb()
    const { chatId, messageId, selectedItem, action } = await req.json()
    const chat = await ChatModel.findById(chatId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    const message = chat.messages.id(messageId)

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    message.isActionDone = true

    switch (action) {
      case "SELECT_ORDER":
        if (!chat.orders.includes(selectedItem._id)) {
          chat.orders.push(selectedItem._id)
        }

        break

      case "SELECT_SUBSCRIPTION":
        if (!chat.subscriptions.includes(selectedItem._id)) {
          chat.subscriptions.push(selectedItem._id)
        }

        break
    }

    await chat.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to update chat action",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
