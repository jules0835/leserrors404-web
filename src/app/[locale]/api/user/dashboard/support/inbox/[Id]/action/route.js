import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { updateChatAction } from "@/db/crud/chatCrud"

export async function POST(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const chatId = params.Id
    const { messageId, selectedItem, action } = await req.json()
    const updatedChat = await updateChatAction(
      chatId,
      messageId,
      selectedItem,
      action
    )

    if (!updatedChat) {
      return NextResponse.json(
        { error: "Chat not found or not active" },
        { status: 404 }
      )
    }

    if (updatedChat.user._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

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
