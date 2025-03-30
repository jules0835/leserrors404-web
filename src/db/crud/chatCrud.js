/* eslint-disable max-params */
import { ChatModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export const createChat = async (data) => {
  await mwdb()

  return ChatModel.create(data)
}

export const findChatByIdForChatBot = async (chatId) => {
  await mwdb()

  return await ChatModel.findOne({
    state: { $in: ["CHAT_BOT", "CHAT_ADMIN"] },
    isActive: true,
    _id: chatId,
  })
}

export const findChatByUserIdForChatBot = async (userId) => {
  await mwdb()

  return await ChatModel.findOne({
    isActive: true,
    state: { $in: ["CHAT_BOT", "CHAT_ADMIN"] },
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

export const findAdminChats = async () => {
  await mwdb()

  const chats = await ChatModel.find({
    state: { $in: ["CHAT_ADMIN", "INBOX"] },
    isActive: true,
  })
    .populate("user")
    .populate("orders")
    .populate("subscriptions")
    .lean()

  return chats.sort((a, b) => {
    const lastMessageA =
      a.messages[a.messages.length - 1]?.sendDate || a.createdAt
    const lastMessageB =
      b.messages[b.messages.length - 1]?.sendDate || b.createdAt

    return new Date(lastMessageB) - new Date(lastMessageA)
  })
}

export const findAdminChatById = async (chatId) => {
  await mwdb()

  return await ChatModel.findById(chatId)
    .populate("user")
    .populate("orders")
    .populate("subscriptions")
}

export const findAdminChatByIdWithMessages = async (chatId) => {
  await mwdb()

  return await ChatModel.findById(chatId)
    .populate("user")
    .populate("orders")
    .populate("subscriptions")
    .populate("products")
}

export const updateChatAction = async (
  chatId,
  messageId,
  selectedItem,
  action
) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  const message = chat.messages.id(messageId)

  if (!message) {
    return null
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

  return await chat.save()
}

export const addAdminMessage = async (chatId, messageData) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.messages.push(messageData)
  const updatedChat = await chat.save()
  await markAdminMessagesAsRead(chatId)

  return updatedChat
}

export const markAdminMessagesAsRead = async (chatId) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat) {
    return null
  }

  chat.messages.forEach((message) => {
    if (message.sender === "USER" && !message.readByAdmin) {
      message.readByAdmin = true
    }
  })

  return await chat.save()
}

export const markUserMessagesAsRead = async (chatId) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat) {
    return null
  }

  chat.messages.forEach((message) => {
    if (
      (message.sender === "BOT" || message.sender === "ADMIN") &&
      !message.readByUser
    ) {
      message.readByUser = true
    }
  })

  return await chat.save()
}

export const endChat = async (chatId, closedBy = "ADMIN") => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.isActive = false
  chat.closeBy = closedBy
  chat.endedAt = new Date()

  const updatedChat = await chat.save()

  await markAdminMessagesAsRead(chatId)
  await markUserMessagesAsRead(chatId)

  return updatedChat
}

export const switchChatToAdmin = async (chatId) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.state = "CHAT_ADMIN"

  return await chat.save()
}

export const updateUserTypingStatus = async (chatId, isTyping) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.isUserTyping = isTyping
  chat.isUserTypingLastUpdate = isTyping ? new Date() : null

  const updatedChat = await chat.save()
  await markUserMessagesAsRead(chatId)

  return updatedChat
}

export const updateAdminTypingStatus = async (chatId, isTyping) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.isAdminTyping = isTyping
  chat.isAdminTypingLastUpdate = isTyping ? new Date() : null

  const updatedChat = await chat.save()
  await markAdminMessagesAsRead(chatId)

  return updatedChat
}

export const updateChatAdminSummary = async (chatId, adminSummary) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  chat.adminSummary = adminSummary
  const updatedChat = await chat.save()
  await markAdminMessagesAsRead(chatId)

  return updatedChat
}
