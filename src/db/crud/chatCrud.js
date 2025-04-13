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

  const chat = await ChatModel.findById(chatId).populate("user")

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

export const findUserChats = async (userId) => {
  await mwdb()
  const chats = await ChatModel.find({
    user: userId,
    state: { $in: ["CHAT_ADMIN", "INBOX"] },
  })
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

export const addMessageToChat = async (chatId, messageData) => {
  await mwdb()

  const chat = await ChatModel.findById(chatId)

  if (!chat || !chat.isActive) {
    return null
  }

  const messageWithDate = {
    ...messageData,
    sendDate: new Date(),
  }

  chat.messages.push(messageWithDate)

  return await chat.save()
}

export const getChatStats = async ({ period = "7d", realTime = false }) => {
  await mwdb()
  const matchQuery = {}

  if (!realTime) {
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7)

        break

      case "30d":
        startDate.setDate(startDate.getDate() - 30)

        break

      case "90d":
        startDate.setDate(startDate.getDate() - 90)

        break
    }

    matchQuery.createdAt = { $gte: startDate }
  }

  const activeTickets = await ChatModel.countDocuments({
    ...matchQuery,
    state: { $in: ["INBOX", "CHAT_ADMIN"] },
    isActive: true,
  })
  const closedTickets = await ChatModel.countDocuments({
    ...matchQuery,
    state: { $in: ["INBOX", "CHAT_ADMIN"] },
    isActive: false,
  })
  const botOnlyChats = await ChatModel.countDocuments({
    ...matchQuery,
    state: "CHAT_BOT",
    isActive: false,
  })
  const activeBotChats = await ChatModel.countDocuments({
    ...matchQuery,
    state: "CHAT_BOT",
    isActive: true,
  })
  const avgResponseTime = await ChatModel.aggregate([
    {
      $match: {
        ...matchQuery,
        state: { $in: ["INBOX", "CHAT_ADMIN"] },
        isActive: false,
      },
    },
    {
      $project: {
        responseTime: {
          $subtract: ["$endedAt", "$createdAt"],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: "$responseTime" },
      },
    },
  ])
  const topUsers = await ChatModel.aggregate([
    {
      $match: {
        ...matchQuery,
        state: { $in: ["INBOX", "CHAT_ADMIN"] },
      },
    },
    {
      $group: {
        _id: "$user",
        ticketCount: { $sum: 1 },
        closedTickets: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
        openTickets: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        userId: "$_id",
        userName: {
          $ifNull: [
            {
              $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"],
            },
            "Unknown",
          ],
        },
        userEmail: { $ifNull: ["$userDetails.email", "N/A"] },
        ticketCount: 1,
        closedTickets: 1,
        openTickets: 1,
      },
    },
    {
      $sort: { ticketCount: -1 },
    },
    {
      $limit: 10,
    },
  ])
  const ticketDistribution = await ChatModel.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: "$state",
        count: { $sum: 1 },
      },
    },
  ])
  const closureDistribution = await ChatModel.aggregate([
    {
      $match: {
        ...matchQuery,
        state: { $in: ["INBOX", "CHAT_ADMIN"] },
        isActive: false,
      },
    },
    {
      $group: {
        _id: "$closeBy",
        count: { $sum: 1 },
      },
    },
  ])
  const resolutionTimeStats = await ChatModel.aggregate([
    {
      $match: {
        ...matchQuery,
        state: { $in: ["INBOX", "CHAT_ADMIN"] },
        isActive: false,
      },
    },
    {
      $project: {
        resolutionTime: {
          $subtract: ["$endedAt", "$createdAt"],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResolutionTime: { $avg: "$resolutionTime" },
        minResolutionTime: { $min: "$resolutionTime" },
        maxResolutionTime: { $max: "$resolutionTime" },
      },
    },
  ])

  return {
    activeTickets,
    closedTickets,
    botOnlyChats,
    activeBotChats,
    avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0,
    topUsers,
    ticketDistribution,
    closureDistribution,
    resolutionTimeStats: resolutionTimeStats[0] || {
      avgResolutionTime: 0,
      minResolutionTime: 0,
      maxResolutionTime: 0,
    },
  }
}
