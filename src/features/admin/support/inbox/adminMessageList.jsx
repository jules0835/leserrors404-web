"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

export default function AdminMessageList({
  chats,
  selectedChatId,
  onSelectChat,
  isFirstLoading,
}) {
  const t = useTranslations("Admin.Chat")
  const isTypingActive = (chat) => {
    if (!chat.isUserTyping || !chat.isUserTypingLastUpdate) {
      return false
    }

    const lastUpdate = new Date(chat.isUserTypingLastUpdate)
    const now = new Date()

    return now - lastUpdate < 30000
  }
  const isAdminTypingActive = (chat) => {
    if (!chat.isAdminTyping || !chat.isAdminTypingLastUpdate) {
      return false
    }

    const lastUpdate = new Date(chat.isAdminTypingLastUpdate)
    const now = new Date()

    return now - lastUpdate < 30000
  }

  if (isFirstLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground">
        {t("noConversations")}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1]
        const unreadCount = chat.messages.filter(
          (msg) => msg.sender === "USER" && !msg.readByAdmin
        ).length
        const userName = chat.user
          ? `${chat.user.firstName} ${chat.user.lastName}`
          : chat.userName

        return (
          <div
            key={chat._id}
            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedChatId === chat._id ? "bg-muted" : ""
            }`}
            onClick={() => onSelectChat(chat._id)}
          >
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                {isTypingActive(chat) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{userName}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lastMessage.sendDate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <div className="flex items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {lastMessage.sender === "ADMIN" ? "You: " : ""}
                    {lastMessage.message}
                  </p>

                  {unreadCount > 0 && (
                    <span className="ml-2 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      chat.state === "CHAT_ADMIN"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {chat.state === "CHAT_ADMIN"
                      ? t("chatAdmin")
                      : t("chatInbox")}
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-primary">
                      {unreadCount} {t("unread")}
                    </span>
                  )}
                  {isTypingActive(chat) && (
                    <span className="text-xs text-muted-foreground">
                      {t("typing")}
                    </span>
                  )}
                  {isAdminTypingActive(chat) && (
                    <span className="text-xs text-muted-foreground">
                      {t("adminTyping")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
