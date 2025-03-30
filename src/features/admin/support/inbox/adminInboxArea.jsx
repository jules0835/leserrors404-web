"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MailCheck, MailX, Send, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAdminChat } from "@/features/admin/support/context/adminChatContext"
import { useTranslations } from "next-intl"
import AdminChatMessage from "@/features/admin/support/inbox/adminChatMessage"
import AdminMessageActions from "@/features/admin/support/inbox/adminMessageActions"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminInboxArea({ chat }) {
  const { sendMessage, isSendingMessage, error, handleTyping } = useAdminChat()
  const [newMessage, setNewMessage] = useState("")
  const [sendAsEmail, setSendAsEmail] = useState(false)
  const messagesEndRef = useRef(null)
  const t = useTranslations("Admin.Chat")
  const typingTimeoutRef = useRef(null)
  const debounceTimeoutRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat.messages, isSendingMessage])

  const handleTypingChange = useCallback(
    (isTyping) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }

        await handleTyping(isTyping)

        if (isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            handleTyping(false)
          }, 30000)
        }
      }, 500)
    },
    [handleTyping]
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

    if (newMessage.trim()) {
      setNewMessage("")
      await sendMessage(newMessage, {
        sendAsEmail,
      })
      handleTypingChange(false)
    }
  }
  const handleBlur = () => {
    handleTypingChange(false)
  }
  const handleSendAction = (action) => {
    if (action.type === "link") {
      sendMessage(action.data.message, {
        link: action.data.link,
        linkType: action.data.linkType,
        linkNeedLogin: action.data.linkNeedLogin,
      })
    } else if (action.type === "action") {
      sendMessage("", {
        isAction: true,
        action: action.data.action,
      })
    }
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
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">
              {chat.user
                ? `${chat.user.firstName} ${chat.user.lastName}`
                : `${chat.userName}`}
            </h2>
            <p className="text-xs text-muted-foreground">
              {chat.user ? chat.user.email : chat.email}
            </p>
          </div>
        </div>

        <div className="mt-1 flex items-center">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              chat.state === "CHAT_ADMIN"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {chat.state === "CHAT_ADMIN" ? t("chatAdmin") : t("chatInbox")}
          </span>

          {chat.isActive ? (
            <span className="text-xs text-green-600 px-2 py-1 bg-green-50 rounded-full">
              {t("active")}
            </span>
          ) : (
            <span className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded-full">
              {t("closed")}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <AdminChatMessage
            key={message._id}
            message={message}
            isAdmin={message.sender === "ADMIN"}
            isBot={message.sender === "BOT"}
            isUserTyping={chat.isUserTyping}
            isUserTypingLastUpdate={chat.isUserTypingLastUpdate}
          />
        ))}

        {isSendingMessage && (
          <AdminChatMessage
            message={{
              sender: "ADMIN",
              message: <Skeleton className="w-full h-10" />,
              sendDate: new Date(),
              isBotReply: false,
              readByUser: false,
            }}
            isAdmin={true}
            isBot={false}
          />
        )}
        {chat.isUserTyping && (
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
      {chat.isActive && sendAsEmail && (
        <div className="text-center text-sm rounded-lg border-t border-red-500 p-2 flex items-center justify-center gap-2">
          <MailCheck className="h-4 w-4" />
          {t("sendAsEmail")}
        </div>
      )}
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
              disabled={!chat.isActive}
            />
            <Button
              type="submit"
              disabled={
                !newMessage.trim() || !chat.isActive || isSendingMessage
              }
            >
              {isSendingMessage ? (
                <AnimatedReload />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setSendAsEmail(!sendAsEmail)}
              variant="outline"
              className={sendAsEmail ? "border-red-500" : ""}
            >
              {sendAsEmail ? (
                <MailX className="h-4 w-4" />
              ) : (
                <MailCheck className="h-4 w-4" />
              )}
            </Button>
            <AdminMessageActions
              onSendAction={handleSendAction}
              isLoggedIn={chat?.user}
            />
          </form>
        )}
      </div>
    </div>
  )
}
