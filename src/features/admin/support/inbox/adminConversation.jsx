"use client"

import AdminInboxArea from "@/features/admin/support/inbox/adminInboxArea"
import AdminConversationDetails from "@/features/admin/support/inbox/adminConversationDetails"
import AdminInboxSkeleton from "@/features/admin/support/inbox/adminInboxSkeleton"
import { useAdminChat } from "@/features/admin/support/context/adminChatContext"
import { useTranslations } from "next-intl"
import { MessageSquareOff } from "lucide-react"

export default function AdminConversation() {
  const { selectedChat, isFirstFetchingSelectedChat } = useAdminChat()
  const t = useTranslations("Admin.Chat")

  if (isFirstFetchingSelectedChat) {
    return <AdminInboxSkeleton />
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageSquareOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p>{t("selectConversation")}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AdminInboxArea chat={selectedChat} />
      <AdminConversationDetails chat={selectedChat} />
    </>
  )
}
