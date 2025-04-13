"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Headset, MessageSquareOff } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUserInbox } from "@/features/user/support/inbox/context/userInboxContext"
import { useTranslations } from "next-intl"
import UserChatMessage from "@/features/user/support/inbox/userChatMessage"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { updateUserTypingStatus } from "@/features/user/support/inbox/service/userInboxService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UserInboxArea({ chat }) {
  const {
    handleSendMessage,
    isLoading,
    error,
    tempMessage,
    isLoadingSelectedChat,
    handleEndChat,
    isEndingChat,
    isSendingMessage,
  } = useUserInbox()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)
  const t = useTranslations("User.Chat")
  const typingTimeoutRef = useRef(null)
  const debounceTimeoutRef = useRef(null)
  const allMessages = chat.messages || []
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, tempMessage, isLoading])

  const handleTypingChange = useCallback(
    (isTyping) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }

        await updateUserTypingStatus(chat._id, isTyping)

        if (isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            updateUserTypingStatus(chat._id, false)
          }, 30000)
        }
      }, 500)
    },
    [chat._id]
  )

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    },
    []
  )

  const handleChange = (e) => {
    setNewMessage(e.target.value)
    handleTypingChange(true)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newMessage.trim() && chat.isActive) {
      const messageToSend = newMessage.trim()
      setNewMessage("")
      await handleSendMessage(messageToSend)
      handleTypingChange(false)
    }
  }
  const handleBlur = () => {
    handleTypingChange(false)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {error && (
        <div className="border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{t("error")}</p>
        </div>
      )}
      <div className="px-4 h-16 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <Headset className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{t("adminSupport")}</h2>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2">
          {chat.isActive ? (
            <>
              <span className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded-full">
                {t("active")}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="ml-2">
                    <MessageSquareOff className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("endChat.title")}</DialogTitle>
                    <DialogDescription>
                      {t("endChat.description")}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEndChat()
                      }}
                    >
                      {t("endChat.cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleEndChat}
                      disabled={isEndingChat}
                    >
                      {isEndingChat ? <AnimatedReload /> : t("endChat.confirm")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <span className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded-full">
              {t("closed")}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((message) => (
          <UserChatMessage
            key={message._id}
            chatId={chat._id}
            message={message}
            isUser={message.sender === "USER"}
            isBot={message.sender === "BOT"}
            isAdmin={message.sender === "ADMIN"}
            isAdminTyping={chat.isAdminTyping}
            isAdminTypingLastUpdate={chat.isAdminTypingLastUpdate}
            isOptimistic={message._id.startsWith("temp-")}
          />
        ))}

        {chat.isAdminTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 h-16 border-t">
        {!chat.isActive && (
          <div className="text-center text-sm text-muted-foreground">
            {t("chatClosed")}
          </div>
        )}
        {chat.isActive && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("typeMessage")}
              className="flex-1"
              disabled={!chat.isActive || isLoadingSelectedChat}
            />
            <Button
              type="submit"
              disabled={
                !newMessage.trim() ||
                !chat.isActive ||
                isLoading ||
                isLoadingSelectedChat ||
                isSendingMessage
              }
            >
              {isLoading ? <AnimatedReload /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
