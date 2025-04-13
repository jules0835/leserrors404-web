import axios from "axios"

export const getAdminChats = async () => {
  const response = await axios.get("/api/contact/admin/chat")

  return response.data
}

export const getAdminChat = async (chatId) => {
  const response = await axios.post("/api/contact/admin/chat", { chatId })

  return response.data
}

export const createAdminChat = async (userId) => {
  const response = await axios.post("/api/contact/admin/chat/new", {
    userId,
  })

  return response.data
}

export const sendAdminMessage = async (chatId, message, options = {}) => {
  const response = await axios.post("/api/contact/admin/chat", {
    chatId,
    message,
    ...options,
  })

  return response.data
}

export const markAdminMessagesAsRead = async (chatId) => {
  const response = await axios.post("/api/contact/admin/chat/read", {
    chatId,
  })

  return response.data
}

export const updateAdminTypingStatus = async (chatId, isTyping) => {
  const response = await axios.post("/api/contact/admin/chat/typing", {
    chatId,
    isTyping,
  })

  return response.data
}

export const endAdminChat = async (chatId) => {
  const response = await axios.post("/api/contact/admin/chat/end", {
    chatId,
  })

  return response.data
}

export const saveAdminSummary = async (chatId, adminSummary) => {
  const response = await axios.post("/api/contact/admin/chat/summary", {
    chatId,
    adminSummary,
  })

  return response.data
}

export const getTicketsList = async ({
  limit = 10,
  page = 1,
  query = "",
  sortField = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const response = await axios.get("/api/admin/support/tickets", {
    params: {
      limit,
      page,
      query,
      sortField,
      sortOrder,
    },
  })

  return response.data
}
