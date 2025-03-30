import { formatDistanceToNow } from "date-fns"
import { FileQuestion, Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef } from "react"

export default function AdminChatMessage({
  message,
  isAdmin,
  isBot,
  isUserTyping,
  isUserTypingLastUpdate,
}) {
  const t = useTranslations("Admin.Chat")
  const messagesEndRef = useRef(null)
  const isTypingActive = () => {
    if (!isUserTyping || !isUserTypingLastUpdate) {
      return false
    }

    const lastUpdate = new Date(isUserTypingLastUpdate)
    const now = new Date()

    return now - lastUpdate < 30000
  }
  const renderMessageContent = () => {
    if (message.isAction) {
      return (
        <div
          className={`p-2 rounded-md mb-2 ${
            message.isActionDone ? "bg-green-200" : "bg-orange-200"
          }`}
        >
          <FileQuestion className="w-4 h-4 mr-2" />
          <p className="font-medium">
            {t("actionRequired")}: {t(message.action)}
          </p>
          <p className="text-sm">{message.message}</p>
          <p className="text-xs mt-1">
            {message.isActionDone ? t("completed") : t("pending")}
          </p>
        </div>
      )
    }

    if (message.isBotQuery && message.botQuerySelectionOptions?.length > 0) {
      return (
        <div>
          <p>{message.message}</p>
          <div className="mt-2 space-y-2">
            {message.botQuerySelectionOptions.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left p-2 bg-muted/50 hover:bg-muted rounded-md text-sm"
              >
                {option.transKey}: {option.value}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (message.link) {
      return (
        <div>
          <p>{message.message}</p>
          <a
            href={message.link}
            target={message.linkType === "external" ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="text-primary underline text-sm mt-1 block"
          >
            {message.link}
            {message.linkNeedLogin && ` (${t("loginRequired")})`}
          </a>
        </div>
      )
    }

    return <p>{message.message}</p>
  }

  return (
    <div className="space-y-4">
      <div
        className={`flex ${isAdmin || isBot ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            isAdmin || isBot
              ? "bg-blue-200  rounded-br-none"
              : "bg-muted rounded-bl-none"
          }`}
        >
          {renderMessageContent()}
          <div className={`text-xs mt-1 flex items-center gap-1`}>
            {formatDistanceToNow(new Date(message.sendDate), {
              addSuffix: true,
            })}{" "}
            - {message.sender}
            {isAdmin && (
              <span className="ml-1">
                {message.readByUser ? (
                  <Eye className="w-3 h-3 text-green-500" />
                ) : (
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                )}
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
