/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import {
  getAdminChats,
  getAdminChat,
  sendAdminMessage,
  markAdminMessagesAsRead,
  updateAdminTypingStatus,
  endAdminChat,
} from "@/features/admin/support/service/adminChatService"

const AdminChatContext = createContext()

export const AdminChatProvider = ({ children }) => {
  const { data: session } = useSession()
  const params = useParams()
  const selectedChatId = params?.Id
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isFirstLoading, setIsFirstLoading] = useState(true)
  const [isFirstFetchingSelectedChat, setIsFirstFetchingSelectedChat] =
    useState(false)
  const [error, setError] = useState(null)
  const [lastSelectedChatId, setLastSelectedChatId] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const [isEndingChat, setIsEndingChat] = useState(false)
  const {
    data: chatsData,
    refetch: refetchChats,
    isFetching: isFetchingChats,
    isSuccess: isSuccessChats,
  } = useQuery({
    queryKey: ["admin-chats"],
    queryFn: getAdminChats,
    enabled: Boolean(session?.user?.isAdmin),
    refetchInterval: 8000,
  })
  const {
    data: selectedChatData,
    refetch: refetchSelectedChat,
    isFetching: isFetchingSelectedChat,
    isSuccess: isSuccessSelectedChat,
  } = useQuery({
    queryKey: ["admin-chat", selectedChatId],
    queryFn: () => getAdminChat(selectedChatId),
    enabled: Boolean(selectedChatId) && Boolean(session?.user?.isAdmin),
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (selectedChatId && lastSelectedChatId !== selectedChatId) {
      setIsFirstFetchingSelectedChat(true)
    } else if (
      selectedChatId &&
      isSuccessSelectedChat &&
      !isFetchingSelectedChat &&
      lastSelectedChatId === selectedChatId
    ) {
      setIsFirstFetchingSelectedChat(false)
    }

    setLastSelectedChatId(selectedChatId)
  }, [
    selectedChatId,
    isSuccessSelectedChat,
    isFetchingSelectedChat,
    lastSelectedChatId,
  ])

  useEffect(() => {
    if (isSuccessChats) {
      setIsFirstLoading(false)
    }
  }, [isSuccessChats])

  useEffect(() => {
    if (chatsData?.chats) {
      const count = chatsData.chats.reduce(
        (total, chat) =>
          total +
          chat.messages.filter(
            (msg) => msg.sender === "USER" && !msg.readByAdmin
          ).length,
        0
      )
      setUnreadCount(count)
    }
  }, [chatsData?.chats])

  useEffect(() => {
    if (selectedChatId) {
      handleMarkMessagesAsRead()
    }
  }, [selectedChatId])

  const handleMarkMessagesAsRead = async () => {
    try {
      if (selectedChatId) {
        await markAdminMessagesAsRead(selectedChatId)
        await refetchSelectedChat()
        await refetchChats()
      }
    } catch (errorMarkMessagesAsRead) {
      setError(
        errorMarkMessagesAsRead?.response?.data?.error ||
          errorMarkMessagesAsRead.message
      )
    }
  }
  const handleSendMessage = async (message, options = {}) => {
    if (!selectedChatId) {
      return
    }

    setError(null)

    try {
      setIsSendingMessage(true)
      await sendAdminMessage(selectedChatId, message, options)
      await refetchSelectedChat()
    } catch (errorSendMessage) {
      setError(
        errorSendMessage?.response?.data?.error || errorSendMessage.message
      )
    } finally {
      setIsSendingMessage(false)
    }
  }
  const handleTyping = async (isAdminTyping) => {
    if (!selectedChatId) {
      return
    }

    setIsTyping(isAdminTyping)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    try {
      await updateAdminTypingStatus(selectedChatId, isAdminTyping)
    } catch (errorUpdateAdminTypingStatus) {
      setError(
        errorUpdateAdminTypingStatus?.response?.data?.error ||
          errorUpdateAdminTypingStatus.message
      )
    }

    if (isAdminTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        updateAdminTypingStatus(selectedChatId, false)
      }, 30000)
    }
  }

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    },
    []
  )

  const handleEndChat = async () => {
    if (!selectedChatId) {
      return
    }

    setError(null)

    try {
      setIsEndingChat(true)
      await endAdminChat(selectedChatId)
      await refetchSelectedChat()
      await refetchChats()
    } catch (errorEndChat) {
      setError(errorEndChat?.response?.data?.error || errorEndChat.message)
    } finally {
      setIsEndingChat(false)
    }
  }

  return (
    <AdminChatContext.Provider
      value={{
        chats: chatsData?.chats || [],
        selectedChat: selectedChatData?.chat,
        selectedChatId,
        isSendingMessage,
        isFirstLoading,
        error,
        isFetchingChats,
        isFirstFetchingSelectedChat,
        sendMessage: handleSendMessage,
        refetchChats,
        refetchSelectedChat,
        unreadCount,
        isTyping,
        handleTyping,
        endChat: handleEndChat,
        isEndingChat,
      }}
    >
      {children}
    </AdminChatContext.Provider>
  )
}

export const useAdminChat = () => useContext(AdminChatContext)
