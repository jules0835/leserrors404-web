"use client"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ChatBox from "@/features/contact/chatbot/chatBox"
import { MessagesSquare } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function WidgetChatbot() {
  const [canDisplay, setCanDisplay] = useState(false)
  const { isOpen, openChat, closeChat, unreadCount } = useChat()
  const t = useTranslations("Contact.Chatbot")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isAppMobileLogin = searchParams.get("appMobileLogin")

  useEffect(() => {
    if (
      pathname.includes("/admin") ||
      isAppMobileLogin ||
      pathname.includes("/shop/checkout/redirect") ||
      pathname.includes("/user/dashboard")
    ) {
      setCanDisplay(false)
    } else {
      setCanDisplay(true)
    }
  }, [pathname, isAppMobileLogin])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openChat() : closeChat())}
    >
      {canDisplay && (
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 bg-[#2F1F80] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-white">
            <MessagesSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
            {t("widget.title")}
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-lg p-0">
        <ChatBox />
      </DialogContent>
    </Dialog>
  )
}
