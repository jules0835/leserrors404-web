"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"
import { trimString } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function AdminMessageList({
  chats,
  selectedChatId,
  onSelectChat,
  isFirstLoading,
}) {
  const t = useTranslations("Admin.Chat")

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
      {chats &&
        chats?.length > 0 &&
        chats?.map((chat) => {
          const lastMessage = chat?.messages[chat?.messages?.length - 1]
          const unreadCount = chat?.messages?.filter(
            (msg) => msg.sender === "USER" && !msg.readByAdmin
          ).length
          const userName = chat?.user
            ? `${chat?.user?.firstName} ${chat?.user?.lastName}`
            : chat?.userName

          return (
            <div
              key={chat?._id}
              className={`px-2 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedChatId === chat?._id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectChat(chat?._id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">
                      {trimString(userName, 15)}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {lastMessage &&
                        formatDistanceToNow(new Date(lastMessage?.sendDate), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>

                  {lastMessage && (
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {lastMessage?.sender === "ADMIN" ? `${t("you")}: ` : ""}
                        {lastMessage?.message}
                        {lastMessage?.isAction &&
                          !lastMessage?.isActionDone && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-orange-300"
                            >
                              {t("waitingAction")}
                            </Badge>
                          )}
                        {lastMessage?.isAction && lastMessage?.isActionDone && (
                          <Badge
                            variant="outline"
                            className="ml-2 border-green-300"
                          >
                            {t("actionDone")}
                          </Badge>
                        )}
                      </p>

                      {unreadCount > 0 && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></span>
                      )}
                    </div>
                  )}

                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        chat?.state === "CHAT_ADMIN"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {chat?.state === "CHAT_ADMIN"
                        ? t("chatAdmin")
                        : t("chatInbox")}
                    </Badge>

                    {!lastMessage && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800"
                      >
                        {t("new")}
                      </Badge>
                    )}

                    {unreadCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"
                      >
                        {unreadCount} {t("unread")}
                      </Badge>
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
