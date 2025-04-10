import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { ChatModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export async function POST(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    await mwdb()

    const newChat = await ChatModel.create({
      user: userId,
      state: "INBOX",
      messages: [
        {
          sender: "USER",
          message,
          readByUser: true,
          readByAdmin: false,
          sendDate: new Date(),
        },
      ],
    })

    return NextResponse.json({
      success: true,
      chatId: newChat._id.toString(),
    })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to create new inbox chat",
      data: {
        error,
      },
      isError: true,
      technicalMessage: error.message,
      authorId: getReqUserId(req),
    })

    return NextResponse.json(
      { error: "Failed to create new chat" },
      { status: 500 }
    )
  }
}
