"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Cookies from "js-cookie"
import {
  getChat,
  startChat,
  endChat,
  sendMessage,
} from "../service/chatService"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [chatId, setChatId] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [error, setError] = useState(null)
  const {
    data: chatData,
    refetch,
    isFetching: isFetchingChat,
  } = useQuery({
    queryKey: ["chat-session"],
    queryFn: getChat,
    enabled: false,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (session?.user) {
      Cookies.remove("chatId")
    }
  }, [session])

  const openChat = () => {
    setIsOpen(true)
    refetch()
  }
  const closeChat = () => {
    setError(null)
    setIsOpen(false)
    Cookies.remove("chatId")
  }
  const handleStartChat = async (formData) => {
    setError(null)

    setIsStarting(true)
    const response = await startChat(formData)

    if (response?.error) {
      setError(response.error)
      setIsStarting(false)

      return
    }

    if (!session?.user && response?.chatId) {
      Cookies.set("chatId", response.chatId, { expires: 7 })
      setChatId(response.chatId)
    }

    await refetch()
    setIsStarting(false)
  }
  const handleEndChat = async () => {
    setError(null)

    try {
      setIsEnding(true)
      await endChat()
      await refetch()
    } catch (errorEndChat) {
      setError(errorEndChat)
    } finally {
      setIsEnding(false)
    }
  }
  const handleSendMessage = async (message, isBotReply = false) => {
    setError(null)

    try {
      setIsSendingMessage(true)
      await sendMessage(message, isBotReply)
      await refetch()
    } catch (errorSendMessage) {
      setError(errorSendMessage)
    } finally {
      setIsSendingMessage(false)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        chatData,
        refetch,
        chatId,
        startChat: handleStartChat,
        endChat: handleEndChat,
        sendMessage: handleSendMessage,
        isStarting,
        isEnding,
        isSendingMessage,
        error,
        isFetchingChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
