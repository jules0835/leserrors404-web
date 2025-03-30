import { logKeys } from "@/assets/options/config"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { NextResponse } from "next/server"
import { updateAdminTypingStatus } from "@/db/crud/chatCrud"

export async function POST(req) {
  try {
    const isAdmin = getReqIsAdmin(req)
    const { chatId, isTyping } = await req.json()

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      )
    }

    const chat = await updateAdminTypingStatus(chatId, isTyping)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to update admin typing status",
      technicalMessage: error.message,
      isError: true,
      data: { error },
      authorId: getReqUserId(req),
    })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
