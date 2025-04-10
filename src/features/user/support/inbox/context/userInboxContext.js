/* eslint-disable max-params */
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getUserInbox,
  sendMessageToAdmin,
  markMessagesAsRead,
  updateUserTypingStatus,
  getChatById,
  endChat,
} from "@/features/user/support/inbox/service/userInboxService"
import { completeAction } from "@/features/contact/chatbot/service/chatActionService"

const UserInboxContext = createContext()

export const UserInboxProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isCompletingAction, setIsCompletingAction] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isEndingChat, setIsEndingChat] = useState(false)
  const [tempMessage, setTempMessage] = useState(null)
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const { data: inboxData, isLoading } = useQuery({
    queryKey: ["userInbox"],
    queryFn: getUserInbox,
    refetchInterval: 10000,
  })
  const { data: selectedChatData, isLoading: isLoadingSelectedChat } = useQuery(
    {
      queryKey: ["selectedChat", selectedChat?._id],
      queryFn: () => getChatById(selectedChat?._id),
      refetchInterval: 5000,
      enabled: Boolean(selectedChat?._id),
    }
  )

  useEffect(() => {
    if (selectedChatData && selectedChat) {
      if (tempMessage) {
        const updatedChat = { ...selectedChatData }
        const messageExists = updatedChat.messages.some(
          (msg) => msg._id === tempMessage._id
        )

        if (!messageExists) {
          updatedChat.messages.push(tempMessage)
        }

        setSelectedChat(updatedChat)
      } else {
        setSelectedChat(selectedChatData)
      }
    }
  }, [selectedChatData, tempMessage])

  const handleSendMessage = async (message) => {
    if (!selectedChat) {
      return
    }

    try {
      setIsSendingMessage(true)
      const newMessage = {
        _id: `temp-${Date.now()}`,
        sender: "USER",
        message,
        isBotReply: false,
        readByUser: false,
        sendDate: new Date(),
      }

      setTempMessage(newMessage)

      const updatedChat = { ...selectedChat }
      updatedChat.messages.push(newMessage)
      setSelectedChat(updatedChat)

      await sendMessageToAdmin(selectedChat._id, message)

      queryClient.invalidateQueries(["userInbox"])
      queryClient.invalidateQueries(["selectedChat", selectedChat._id])

      setTempMessage(null)
    } catch (errorTempMess) {
      setTempMessage(null)
    } finally {
      setIsSendingMessage(false)
    }
  }
  const handleMarkAsRead = async () => {
    if (!selectedChat) {
      return
    }

    const hasUnreadMessages = selectedChat.messages.some(
      (message) =>
        (message.sender === "BOT" || message.sender === "ADMIN") &&
        !message.readByUser
    )

    if (hasUnreadMessages) {
      await markMessagesAsRead(selectedChat._id)
      queryClient.invalidateQueries(["userInbox"])
      queryClient.invalidateQueries(["selectedChat", selectedChat._id])
    }
  }
  const handleTypingStatus = async (isUserTyping) => {
    if (!selectedChat) {
      return
    }

    setIsTyping(isUserTyping)
    await updateUserTypingStatus(selectedChat._id, isUserTyping)
  }
  const handleEndChat = async () => {
    if (!selectedChat) {
      return
    }

    setIsEndingChat(true)
    await endChat(selectedChat._id)

    queryClient.invalidateQueries(["userInbox"])
    queryClient.invalidateQueries(["selectedChat", selectedChat._id])
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

      queryClient.invalidateQueries(["userInbox"])
      queryClient.invalidateQueries(["selectedChat", completedChatId])
    } catch (errorCompleteSelectedAction) {
      handleError(errorCompleteSelectedAction)
    } finally {
      setIsCompletingAction(false)
    }
  }
  const handleError = (errorHandle) => {
    setError(errorHandle)
  }

  useEffect(() => {
    if (selectedChat) {
      handleMarkAsRead()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  const value = {
    inboxData,
    isLoading,
    selectedChat,
    setSelectedChat,
    isTyping,
    handleSendMessage,
    handleMarkAsRead,
    handleTypingStatus,
    isSelectedChatActive: selectedChat?.isActive,
    isCompletingAction,
    completeSelectedAction,
    tempMessage,
    isLoadingSelectedChat,
    handleEndChat,
    isEndingChat,
    error,
    isSendingMessage,
  }

  return (
    <UserInboxContext.Provider value={value}>
      {children}
    </UserInboxContext.Provider>
  )
}

export const useUserInbox = () => {
  const context = useContext(UserInboxContext)

  if (!context) {
    throw new Error("useUserInbox must be used within a UserInboxProvider")
  }

  return context
}
