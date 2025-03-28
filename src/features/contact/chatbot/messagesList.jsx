import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function MessagesList() {
  const { chatData, isStarting, isEnding, isSendingMessage } = useChat()
  const messages = useMemo(
    () => chatData?.chat?.messages || [],
    [chatData?.chat?.messages]
  )
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSendingMessage, isStarting, isEnding])

  return (
    <div className="flex flex-col gap-4 p-4">
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

                {msg.isAction && !msg.isActionDone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="mt-1 text-xs text-orange-500 italic"
                  >
                    ⚠️ Action requise : {msg.action}
                  </motion.p>
                )}

                {msg.isAction && msg.isActionDone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="mt-1 text-xs text-green-500 italic"
                  >
                    ✅ Action complétée
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {isSendingMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-row-reverse gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </div>
          </div>
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
