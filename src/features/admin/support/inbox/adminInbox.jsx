"use client"

import { useState } from "react"
import AdminMessageList from "@/features/admin/support/inbox/adminMessageList"
import AdminInboxArea from "@/features/admin/support/inbox/adminInboxArea"
import AdminConversationDetails from "@/features/admin/support/inbox/adminConversationDetails"
import { useAdminChat } from "@/features/admin/support/context/adminChatContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageSquareOff, Headset } from "lucide-react"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter, useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function AdminInbox() {
  const {
    chats = [],
    selectedChat,
    isFirstFetchingSelectedChat,
    isFirstLoading,
    error,
  } = useAdminChat() || {}
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations("Admin.Chat")
  const router = useRouter()
  const params = useParams()
  const selectedChatId = params?.Id
  const hasUnreadMessages = (chat) =>
    chat.messages.some(
      (msg) => msg.sender === "USER" && (!msg.readBy || msg.readBy.length === 0)
    )
  const handleSelectChat = (chatId) => {
    router.push(`/admin/support/inbox/${chatId}`)
  }
  const filteredChats = chats.filter((chat) => {
    if (showUnreadOnly && !hasUnreadMessages(chat)) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      return (
        chat.user?.firstName?.toLowerCase().includes(query) ||
        chat.user?.lastName?.toLowerCase().includes(query) ||
        chat.user?.email?.toLowerCase().includes(query) ||
        chat.messages.some((msg) => msg.message?.toLowerCase().includes(query))
      )
    }

    return true
  })

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {error && (
        <div className="border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{t("error")}</p>
        </div>
      )}

      <div className="w-full md:max-w-72 lg:w-80 border-r flex flex-col bg-muted/30">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Headset className="h-6 w-6" />-
            <h1 className="text-xl font-bold">Support inbox</h1>
          </div>
          <Separator className="my-2" />
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={!showUnreadOnly ? "default" : "outline"}
              className="flex-1"
              onClick={() => setShowUnreadOnly(false)}
            >
              {t("all")}
            </Button>
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              className="flex-1"
              onClick={() => setShowUnreadOnly(true)}
            >
              {t("unread")}
            </Button>
          </div>
        </div>

        <AdminMessageList
          chats={filteredChats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          hasUnreadMessages={hasUnreadMessages}
          isFirstLoading={isFirstLoading}
        />
      </div>

      <div className="flex-1 flex">
        {isFirstFetchingSelectedChat && (
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${i % 2 === 0 ? "bg-primary/10" : "bg-muted"}`}
                    >
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Skeleton className="flex-1 h-10" />
                </div>
              </div>
            </div>

            <div className="w-80 border-l bg-muted/30 hidden lg:block overflow-y-auto">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="p-4 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="h-6 w-32 mt-2" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedChat && !isFirstFetchingSelectedChat && (
          <>
            <AdminInboxArea chat={selectedChat} />
            <AdminConversationDetails chat={selectedChat} />
          </>
        )}
        {!selectedChatId && !isFirstFetchingSelectedChat && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquareOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>{t("selectConversation")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
