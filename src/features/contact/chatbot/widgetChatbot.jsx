"use client"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ChatBox from "@/features/contact/chatbot/chatBox"
import { MessagesSquare } from "lucide-react"
import { useTranslations } from "next-intl"

export default function WidgetChatbot() {
  const { isOpen, openChat, closeChat } = useChat()
  const t = useTranslations("Contact.Chatbot")

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openChat() : closeChat())}
    >
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-all duration-300">
          <MessagesSquare className="w-6 h-6" />
          {t("widget.title")}
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg p-0">
        <ChatBox />
      </DialogContent>
    </Dialog>
  )
}
