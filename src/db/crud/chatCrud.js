import { ChatModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export const createChat = async (data) => {
  await mwdb()

  return ChatModel.create(data)
}

export const findChatByIdForBot = async (chatId) => {
  await mwdb()

  return await ChatModel.findOne({
    state: "CHAT_BOT",
    isActive: true,
    _id: chatId,
  })
}

export const findChatByUserIdForBot = async (userId) => {
  await mwdb()

  return await ChatModel.findOne({
    isActive: true,
    state: "CHAT_BOT",
    user: userId,
  })
}

export const createChatForBotNoUser = async ({ userName, email, message }) => {
  await mwdb()

  return await ChatModel.create({
    userName,
    email,
    state: "CHAT_BOT",
    messages: [message],
  })
}

export const createChatForBotUser = async ({ userId, message }) => {
  await mwdb()

  return await ChatModel.create({
    user: userId,
    state: "CHAT_BOT",
    messages: [message],
  })
}
