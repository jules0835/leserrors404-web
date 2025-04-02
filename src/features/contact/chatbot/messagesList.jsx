import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  ExternalLink,
  KeyRound,
  MessageSquareMore,
  User,
  Eye,
  EyeOff,
  ClipboardCheck,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DButton from "@/components/ui/DButton"
import { useLocale, useTranslations } from "next-intl"
import ChatActionButton from "@/features/contact/chatbot/chatActionButton"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

export default function MessagesList() {
  const {
    chatData,
    isStarting,
    isEnding,
    isSendingMessage,
    needLogin,
    switchToAdmin,
    isSwitchingToAdmin,
    error,
    completeSelectedAction,
    isCompletingAction,
    tempMessage,
  } = useChat()
  const messages = useMemo(() => {
    const chatMessages = chatData?.chat?.messages || []

    return tempMessage ? [...chatMessages, tempMessage] : chatMessages
  }, [chatData?.chat?.messages, tempMessage])
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const t = useTranslations("Contact.Chatbot.Messages")
  const locale = useLocale()

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSendingMessage, isStarting, isEnding])

  const handleActionComplete = async (message, selectedItem) => {
    if (message.isActionDone) {
      return
    }

    await completeSelectedAction(
      chatData.chat._id,
      message._id,
      selectedItem,
      message.action
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {error && (
        <div className="border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{t("error")}</p>
        </div>
      )}

      <AnimatePresence>
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "USER"
          const isBot = msg.sender === "BOT"
          const isAdmin = msg.sender === "ADMIN"

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: isUser ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {isUser && <User className="h-4 w-4" />}
                    {isAdmin && <User className="h-4 w-4" />}
                    {isBot && <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.message}</p>

                {msg.action === "CONTACT_HUMAN" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <DButton
                      isMain
                      styles="text-xs"
                      onClickBtn={switchToAdmin}
                      isDisabled={chatData?.chat?.state === "CHAT_ADMIN"}
                    >
                      {isSwitchingToAdmin ? (
                        <AnimatedReload />
                      ) : (
                        <>
                          {t("contactHuman")}{" "}
                          <MessageSquareMore size={18} className="ml-2" />
                        </>
                      )}
                    </DButton>
                  </motion.div>
                )}

                {msg.isAction && !msg.isActionDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="text-sm"
                  >
                    {t(msg.action)}
                    <ChatActionButton
                      action={msg.action}
                      onActionComplete={(selectedItem) =>
                        handleActionComplete(msg, selectedItem)
                      }
                      isDisabled={
                        !chatData?.chat?.isActive || isCompletingAction
                      }
                      isLoading={isCompletingAction}
                    />
                  </motion.div>
                )}

                {msg.isAction && msg.isActionDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="text-sm"
                  >
                    {t(msg.action)}
                    <Button
                      variant="outline"
                      className="mt-1 text-xs text-green-500 w-full"
                    >
                      <ClipboardCheck size={18} />
                      {t("actionCompleted")}
                    </Button>
                  </motion.div>
                )}

                {msg.link &&
                  msg.linkType === "internal" &&
                  (!msg.linkNeedLogin || !needLogin) && (
                    <DButton
                      isMain
                      onClickBtn={() => {
                        window.open(`/${locale}${msg.link}`, "_blank")
                      }}
                      styles="gap-2 text-xs"
                    >
                      {t("seeLink")}
                      <ExternalLink size={18} />
                    </DButton>
                  )}

                {msg.link &&
                  msg.linkType === "external" &&
                  (!msg.linkNeedLogin || !needLogin) && (
                    <DButton
                      isMain
                      onClickBtn={() => {
                        window.open(`${msg.link}`, "_blank")
                      }}
                      styles="gap-2 text-xs"
                    >
                      {t("seeLink")}
                      <ExternalLink size={18} />
                    </DButton>
                  )}
                {msg.link && msg.linkNeedLogin && needLogin && (
                  <DButton
                    isMain
                    onClickBtn={() => {
                      window.open(
                        `/auth/login?next=${`/${locale}${msg.link}`}`,
                        "_blank"
                      )
                    }}
                    styles="gap-2 text-xs"
                  >
                    {t("seeLinkLogin")}
                    <KeyRound size={18} />
                  </DButton>
                )}

                <div className="text-xs mt-1 flex items-center gap-1">
                  {isUser && (
                    <span className="flex items-center gap-1">
                      {formatDistanceToNow(new Date(msg.sendDate), {
                        addSuffix: true,
                      })}
                      {msg.readByAdmin ? (
                        <Eye className="w-3 h-3 text-green-500" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="flex items-center gap-1">
                      {formatDistanceToNow(new Date(msg.sendDate), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {chatData?.chat?.isAdminTyping && (
        <div className="flex justify-start">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="bg-muted p-3 rounded-lg rounded-bl-none ml-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {isSendingMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          {chatData?.chat?.state === "CHAT_BOT" && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px] mt-2" />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {(isStarting || isEnding) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
