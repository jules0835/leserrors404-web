"use client"

import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useUserInbox } from "@/features/user/support/inbox/context/userInboxContext"
import { LifeBuoy, MessageSquareOff } from "lucide-react"
import UserMessageList from "@/features/user/support/inbox/userMessageList"
import UserInboxArea from "@/features/user/support/inbox/userInboxArea"
import UserInboxSkeleton from "@/features/user/support/inbox/userInboxSkeleton"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTitle } from "@/components/navigation/titleContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function UserInbox() {
  const { inboxData, isLoading, error, setSelectedChat, selectedChat } =
    useUserInbox()
  const t = useTranslations("User.Chat")
  const router = useRouter()
  const params = useParams()
  const selectedChatId = params?.Id
  const chats = useMemo(() => inboxData?.chats || [], [inboxData?.chats])
  const { setTitle } = useTitle()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  setTitle(t("title"))

  useEffect(() => {
    if (selectedChatId && chats.length > 0) {
      const chat = chats.find((_chat) => _chat._id === selectedChatId)

      if (chat) {
        setSelectedChat(chat)
      }
    }
  }, [selectedChatId, chats, setSelectedChat])

  const handleSelectChat = (chatId) => {
    router.push(`/user/dashboard/support/tickets/${chatId}`)
    setIsMobileMenuOpen(false)
  }

  return (
    <div>
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden flex mx-auto">
              {t("allOpenInbox")}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] p-0">
            <div className="flex items-center gap-2 border-b h-16 px-4">
              <LifeBuoy className="h-6 w-6" />
              <h1 className="text-xl font-bold">{t("supportInbox")}</h1>
            </div>
            <UserMessageList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              isFirstLoading={isLoading}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-1 overflow-hidden h-full">
        <div className="hidden md:flex w-full md:max-w-72 lg:w-80 border-r flex-col bg-muted/30">
          <div className="flex items-center gap-2 border-b h-16 px-4 justify-between">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-6 w-6" />
              <h1 className="text-xl font-bold">{t("supportInbox")}</h1>
            </div>
          </div>

          {error && (
            <div className="border border-red-500 rounded-lg p-4">
              <p className="text-red-500">{t("error")}</p>
            </div>
          )}

          <UserMessageList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            isFirstLoading={isLoading}
          />
        </div>

        <div className="flex-1 flex">
          {isLoading && <UserInboxSkeleton />}
          {selectedChat && !isLoading && <UserInboxArea chat={selectedChat} />}
          {!selectedChatId && !isLoading && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquareOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>{t("selectConversation")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
