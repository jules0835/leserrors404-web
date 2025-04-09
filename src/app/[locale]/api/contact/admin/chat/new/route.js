import { NextResponse } from "next/server"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import { createChat } from "@/db/crud/chatCrud"
import { findUserById } from "@/db/crud/userCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function POST(req) {
  try {
    const isAdmin = getReqIsAdmin(req)
    const adminUser = await findUserById(getReqUserId(req))

    if (!isAdmin || !adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const user = await findUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newChat = await createChat({
      user: userId,
      state: "INBOX",
      isActive: true,
    })

    return NextResponse.json({ chatId: newChat._id })
  } catch (error) {
    log.systemError({
      logKey: logKeys.chatbotError.key,
      message: "Failed to create new chat",
      technicalMessage: error.message,
      isError: true,
      data: { error },
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
