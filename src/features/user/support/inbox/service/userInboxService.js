import axios from "axios"

export const getUserInbox = async () => {
  const response = await axios.get("/api/user/dashboard/support/inbox")

  return response.data
}

export const sendMessageToAdmin = async (chatId, message) => {
  const response = await axios.post(
    `/api/user/dashboard/support/inbox/${chatId}/message`,
    {
      message,
    }
  )

  return response.data
}

export const markMessagesAsRead = async (chatId) => {
  const response = await axios.post(
    `/api/user/dashboard/support/inbox/${chatId}/read`
  )

  return response.data
}

export const updateUserTypingStatus = async (chatId, isTyping) => {
  const response = await axios.post(
    `/api/user/dashboard/support/inbox/${chatId}/typing`,
    {
      isTyping,
    }
  )

  return response.data
}

export const getChatById = async (chatId) => {
  const response = await fetch(`/api/user/dashboard/support/inbox/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch chat")
  }

  return await response.json()
}

export const endChat = async (chatId) => {
  const response = await fetch(
    `/api/user/dashboard/support/inbox/${chatId}/end`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to end chat")
  }

  return await response.json()
}
