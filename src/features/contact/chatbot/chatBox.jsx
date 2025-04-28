import MessagesList from "@/features/contact/chatbot/messagesList"
import ChatInput from "@/features/contact/chatbot/chatInput"
import WelcomeMessage from "@/features/contact/chatbot/welcomeMessage"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import BotSelector from "@/features/contact/chatbot/botSelector"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bot,
  MessageSquareMore,
  MessageSquareOff,
  UserRound,
} from "lucide-react"
import ErrorFront from "@/components/navigation/error"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { company } from "@/assets/options/config"
import { usePathname, useSearchParams } from "next/navigation"

export default function ChatBox() {
  const {
    chatData,
    endChat,
    closeChat,
    isEnding,
    switchToAdmin,
    shouldReset,
    isSwitchingToAdmin,
  } = useChat()
  const state = chatData?.chatState
  const t = useTranslations("chat")
  const pathname = usePathname()
  const isContactPage = pathname.includes("/contact")
  const searchParams = useSearchParams()
  const isMobileApp = searchParams.get("isAppMobile") === "true"

  if (shouldReset) {
    return <WelcomeMessage />
  }

  if (chatData?.chatState === "CHAT_ERROR") {
    return <ErrorFront />
  }

  if (state === "NO_CHAT") {
    return <WelcomeMessage />
  }

  return (
    <div
      className={`flex flex-col h-[80vh] ${
        isContactPage && isMobileApp ? "h-screen" : ""
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {chatData?.chat?.state === "CHAT_BOT" ? (
            <Bot size={24} />
          ) : (
            <UserRound size={24} />
          )}
          <span>-</span>
          {chatData?.chat?.state === "CHAT_BOT"
            ? `${t("bot")}`
            : `${company.name} ${t("admin")}`}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon" className="mr-8">
              <MessageSquareOff size={48} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("endChat.title")}</DialogTitle>
              <DialogDescription>{t("endChat.description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={closeChat}>
                {t("endChat.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={endChat}
                disabled={isEnding}
              >
                {t("endChat.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MessagesList />
      </div>
      {chatData?.chat?.state === "CHAT_ADMIN" ? <ChatInput /> : <BotSelector />}
      {chatData?.chat?.state === "CHAT_BOT" && (
        <div className="p-4 border-t flex justify-center">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={switchToAdmin}
            disabled={isSwitchingToAdmin}
          >
            {isSwitchingToAdmin ? (
              <div>
                <AnimatedReload />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageSquareMore size={40} />
                {t("chatWithHuman")}
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
