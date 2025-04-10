import { formatDistanceToNow } from "date-fns"
import { Eye, EyeOff, ClipboardCheck, ExternalLink } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRef } from "react"
import { useUserInbox } from "./context/userInboxContext"
import ChatActionButton from "@/features/contact/chatbot/chatActionButton"
import DButton from "@/components/ui/DButton"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function UserChatMessage({
  message,
  isUser,
  isAdminTyping,
  isAdminTypingLastUpdate,
  chatId,
  isOptimistic = false,
}) {
  const t = useTranslations("User.Chat")
  const messagesEndRef = useRef(null)
  const locale = useLocale()
  const { completeSelectedAction, isSelectedChatActive, isCompletingAction } =
    useUserInbox()
  const isTypingActive = () => {
    if (!isAdminTyping || !isAdminTypingLastUpdate) {
      return false
    }

    const lastUpdate = new Date(isAdminTypingLastUpdate)
    const now = new Date()

    return now - lastUpdate < 30000
  }
  const handleActionComplete = async (selectedItem) => {
    if (message.isActionDone) {
      return
    }

    await completeSelectedAction(
      chatId,
      message._id,
      selectedItem,
      message.action
    )
  }

  return (
    <div className="space-y-4">
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none"
          } ${isOptimistic ? "opacity-70" : ""}`}
        >
          <p>{message.message}</p>
          {message.isAction && !message.isActionDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-sm"
            >
              {t(message.action)}
              <ChatActionButton
                action={message.action}
                onActionComplete={(selectedItem) =>
                  handleActionComplete(selectedItem)
                }
                isDisabled={
                  !isSelectedChatActive || isCompletingAction || isOptimistic
                }
                isLoading={isCompletingAction}
              />
            </motion.div>
          )}

          {message.isAction && message.isActionDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-sm"
            >
              {t(message.action)}
              <Button
                variant="outline"
                className="mt-1 text-xs text-green-500 w-full"
              >
                <ClipboardCheck size={18} />
                {t("actionCompleted")}
              </Button>
            </motion.div>
          )}

          {message.link && message.linkType === "internal" && (
            <DButton
              isMain
              onClickBtn={() => {
                window.open(`/${locale}${message.link}`, "_blank")
              }}
              styles="gap-2 text-xs"
            >
              {t("seeLink")}
              <ExternalLink size={18} />
            </DButton>
          )}

          {message.link && message.linkType === "external" && (
            <DButton
              isMain
              onClickBtn={() => {
                window.open(`${message.link}`, "_blank")
              }}
              styles="gap-2 text-xs"
            >
              {t("seeLink")}
              <ExternalLink size={18} />
            </DButton>
          )}

          <div className={`text-xs mt-1 flex items-center gap-1`}>
            {formatDistanceToNow(new Date(message.sendDate), {
              addSuffix: true,
            })}{" "}
            {isUser && !isOptimistic && (
              <span className="ml-1">
                {message.readByAdmin ? (
                  <Eye className="w-3 h-3 text-green-500" />
                ) : (
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                )}
              </span>
            )}
            {isOptimistic && (
              <span className="ml-1 text-xs text-muted-foreground">
                {t("sending")}
              </span>
            )}
          </div>
        </div>
      </div>

      {isTypingActive() && (
        <div className="flex justify-start">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex space-x-2">
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
