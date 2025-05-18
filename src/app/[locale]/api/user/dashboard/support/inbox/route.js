import { NextResponse } from "next/server"

import { findUserChats } from "@/db/crud/chatCrud"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chats = await findUserChats(userId)

    return NextResponse.json({ chats })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to fetch chats from user inbox",
      data: {
        error,
      },
      isError: true,
      technicalMessage: error.message,
    })

    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    )
  }
}
