/* eslint-disable max-params */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Cookies from "js-cookie"
import {
  getChat,
  startChat,
  endChat,
  sendMessageToBot,
  sendMessageToAdmin,
  switchToAdmin,
  markMessagesAsRead,
} from "@/features/contact/chatbot/service/chatService"
import { completeAction } from "@/features/contact/chatbot/service/chatActionService"
import { useTitle } from "@/components/navigation/titleContext"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [needLogin, setNeedLogin] = useState(true)
  const [error, setError] = useState(null)
  const [shouldReset, setShouldReset] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isSwitchingToAdmin, setIsSwitchingToAdmin] = useState(false)
  const [isCompletingAction, setIsCompletingAction] = useState(false)
  const [tempMessage, setTempMessage] = useState(null)
  const {
    data: chatData,
    refetch: refetchChatData,
    isFetching: isFetchingChat,
  } = useQuery({
    queryKey: ["chat-session"],
    queryFn: getChat,
    enabled: true,
    refetchOnWindowFocus: true,
  })
  const { setCount } = useTitle()

  useEffect(() => {
    setCount(unreadCount)
  }, [unreadCount])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        refetchChatData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen, refetchChatData])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        refetchChatData()
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [isOpen, refetchChatData])

  useEffect(() => {
    if (session?.user) {
      const handleSessionChange = async () => {
        setNeedLogin(false)

        if (Cookies.get("chatId")) {
          await endChat()
          await refetchChatData()
        }
      }

      if (session?.user) {
        handleSessionChange()
      }
    }
  }, [session])

  useEffect(() => {
    if (shouldReset) {
      setIsOpen(false)
      setChatId(null)
      Cookies.remove("chatId")
      setShouldReset(false)
    }
  }, [shouldReset])

  useEffect(() => {
    if (chatData?.chat?.messages) {
      const count = chatData.chat.messages.filter(
        (msg) =>
          (msg.sender === "BOT" || msg.sender === "ADMIN") && !msg.readByUser
      ).length
      setUnreadCount(count)
    } else {
      setUnreadCount(0)
    }
  }, [chatData?.chat?.messages])

  useEffect(() => {
    if (isOpen && chatData?.chat?._id) {
      handleMarkMessagesAsRead()
    }
  }, [isOpen, chatData?.chat?._id])

  const handleError = (err) => {
    if (err?.response?.status === 404) {
      setShouldReset(true)

      return true
    }

    setError(err?.response?.data?.error || err.message)

    return false
  }
  const handleMarkMessagesAsRead = async () => {
    try {
      if (chatData?.chat?._id) {
        await markMessagesAsRead()
        await refetchChatData()
        setUnreadCount(0)
      }
    } catch (errorMarkMessagesAsRead) {
      handleError(errorMarkMessagesAsRead)
    }
  }
  const openChat = () => {
    setIsOpen(true)
    refetchChatData()
    setUnreadCount(0)
  }
  const closeChat = () => {
    setError(null)
    setIsOpen(false)
  }
  const handleStartChat = async (formData) => {
    setError(null)
    setIsStarting(true)

    try {
      const response = await startChat(formData)

      if (!session?.user && response?.chatId) {
        Cookies.set("chatId", response.chatId, { expires: 7 })
        setChatId(response.chatId)
      }

      await refetchChatData()
    } catch (errorStartChat) {
      if (!handleError(errorStartChat)) {
        setError(
          errorStartChat?.response?.data?.error || errorStartChat.message
        )
      }
    } finally {
      setIsStarting(false)
    }
  }
  const handleEndChat = async () => {
    setError(null)

    try {
      setIsEnding(true)
      await endChat()
      await refetchChatData()
    } catch (errorEndChat) {
      if (!handleError(errorEndChat)) {
        setError(errorEndChat?.response?.data?.error || errorEndChat.message)
      }
    } finally {
      setIsEnding(false)
    }
  }
  const handleSendMessageToBot = async (message, isBotReply = false) => {
    setError(null)

    const newMessage = {
      _id: Date.now().toString(),
      sender: "USER",
      message,
      sendDate: new Date(),
      readByBot: false,
      isTemp: true,
    }

    setTempMessage(newMessage)

    try {
      setIsSendingMessage(true)
      await sendMessageToBot(message, isBotReply)
      await refetchChatData()
      setTempMessage(null)
    } catch (errorSendMessage) {
      if (!handleError(errorSendMessage)) {
        setError(
          errorSendMessage?.response?.data?.error || errorSendMessage.message
        )
      }

      setTempMessage(null)
    } finally {
      setIsSendingMessage(false)
    }
  }
  const handleSwitchToAdmin = async () => {
    setError(null)

    try {
      setIsSwitchingToAdmin(true)
      await switchToAdmin()
      await refetchChatData()
    } catch (errorSwitchAdmin) {
      if (!handleError(errorSwitchAdmin)) {
        setError(
          errorSwitchAdmin?.response?.data?.error || errorSwitchAdmin.message
        )
      }
    } finally {
      setIsSwitchingToAdmin(false)
    }
  }
  const handleSendMessageToAdmin = async (message) => {
    setError(null)

    const newMessage = {
      _id: Date.now().toString(),
      sender: "USER",
      message,
      sendDate: new Date(),
      readByAdmin: false,
      isTemp: true,
    }

    setTempMessage(newMessage)

    try {
      setIsSendingMessage(true)
      await sendMessageToAdmin(message)
      await refetchChatData()
      setTempMessage(null)
    } catch (errorSendMessageToAdmin) {
      if (!handleError(errorSendMessageToAdmin)) {
        setError(
          errorSendMessageToAdmin?.response?.data?.error ||
            errorSendMessageToAdmin.message
        )
      }

      setTempMessage(null)
    } finally {
      setIsSendingMessage(false)
    }
  }
  const reloadChat = () => {
    setError(null)
    setIsOpen(false)
    Cookies.remove("chatId")
    refetchChatData()
  }
  const completeSelectedAction = async (
    completedChatId,
    completedMessageId,
    completedSelectedItem,
    completedAction
  ) => {
    try {
      setIsCompletingAction(true)
      await completeAction(
        completedChatId,
        completedMessageId,
        completedSelectedItem,
        completedAction
      )
      await refetchChatData()
    } catch (errorCompleteSelectedAction) {
      handleError(errorCompleteSelectedAction)
    } finally {
      setIsCompletingAction(false)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        chatData,
        refetch: refetchChatData,
        chatId,
        startChat: handleStartChat,
        endChat: handleEndChat,
        sendMessageToBot: handleSendMessageToBot,
        sendMessageToAdmin: handleSendMessageToAdmin,
        switchToAdmin: handleSwitchToAdmin,
        isStarting,
        isEnding,
        isSendingMessage,
        error,
        isFetchingChat,
        needLogin,
        shouldReset,
        unreadCount,
        isSwitchingToAdmin,
        reloadChat,
        completeSelectedAction,
        isCompletingAction,
        tempMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
