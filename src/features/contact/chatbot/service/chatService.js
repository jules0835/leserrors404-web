import axios from "axios"

export const startChat = async (formData) => {
  const response = await axios.post("/api/contact/chatbot", formData)

  return response.data
}

export const getChat = async () => {
  const response = await axios.get("/api/contact/chatbot")

  return response.data
}

export const endChat = async () => {
  const response = await axios.post("/api/contact/chatbot/end")

  return response.data
}

export const sendMessage = async (message, isBotReply = false) => {
  const response = await axios.post("/api/contact/chatbot/message", {
    message,
    isBotReply,
  })

  return response.data
}
