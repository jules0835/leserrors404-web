import axios from "axios"

export const startChat = async (formData) => {
  const response = await axios.post("/api/contact/chat", formData)

  return response.data
}

export const getChat = async () => {
  const response = await axios.get("/api/contact/chat")

  return response.data
}

export const endChat = async () => {
  const response = await axios.post("/api/contact/chat/end")

  return response.data
}

export const sendMessageToBot = async (message, isBotReply = false) => {
  const response = await axios.post("/api/contact/chat/bot/message", {
    message,
    isBotReply,
  })

  return response.data
}

export const sendMessageToAdmin = async (message) => {
  const response = await axios.post("/api/contact/chat/admin/message", {
    message,
  })

  return response.data
}

export const switchToAdmin = async () => {
  const response = await axios.post("/api/contact/chat/switch-admin")

  return response.data
}

export const markMessagesAsRead = async () => {
  const response = await axios.post("/api/contact/chat/read")

  return response.data
}

export const updateUserTypingStatus = async (isTyping) => {
  const response = await axios.post("/api/contact/chat/typing", {
    isTyping,
  })

  return response.data
}
