"use client"

import { useState, useEffect } from "react"
import AdminMessageList from "@/features/admin/support/inbox/adminMessageList"
import AdminInboxSelectUser from "@/features/admin/support/inbox/adminInboxSelectUser"
import { useAdminChat } from "@/features/admin/support/context/adminChatContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Headset, MailPlus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useParams } from "next/navigation"

export default function AdminInboxSidebar() {
  const { chats = [], isFirstLoading, error, createChat } = useAdminChat() || {}
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [inboxHasUnreadMessages, setInboxHasUnreadMessages] = useState(false)
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false)
  const t = useTranslations("Admin.Chat")
  const router = useRouter()
  const params = useParams()
  const selectedChatId = params?.Id
  const hasUnreadMessages = (chat) =>
    chat?.messages?.some((msg) => msg.sender === "USER" && !msg.readByAdmin)
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
        chat?.user?.firstName?.toLowerCase().includes(query) ||
        chat?.user?.lastName?.toLowerCase().includes(query) ||
        chat?.user?.email?.toLowerCase().includes(query) ||
        chat?.messages?.some((msg) =>
          msg.message?.toLowerCase().includes(query)
        ) ||
        chat?.user?.company?.toLowerCase().includes(query) ||
        chat?.shortId?.toLowerCase().includes(query) ||
        chat?.adminSummary?.toLowerCase().includes(query)
      )
    }

    return true
  })

  useEffect(() => {
    setInboxHasUnreadMessages(chats.some((chat) => hasUnreadMessages(chat)))
  }, [chats])

  return (
    <div className="w-full md:max-w-72 lg:w-80 border-r flex flex-col bg-muted/30">
      <div className="flex items-center gap-2 border-b h-16 px-4 justify-between">
        <div className="flex items-center gap-2">
          <Headset className="h-6 w-6" /> -
          <h1 className="text-xl font-bold">{t("supportInbox")}</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsUserSelectOpen(true)}
        >
          <MailPlus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 p-4">
        {error && (
          <div className="border border-red-500 rounded-lg p-4">
            <p className="text-red-500">{t("error")}</p>
          </div>
        )}
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
            {inboxHasUnreadMessages && (
              <span className="animate-pulse ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
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

      <AdminInboxSelectUser
        isOpen={isUserSelectOpen}
        setIsOpen={setIsUserSelectOpen}
        returnUser={createChat}
        title={t("createNewChat")}
      />
    </div>
  )
}
