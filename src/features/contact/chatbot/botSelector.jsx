import { useTranslations } from "next-intl"
import { useChat } from "./context/chatContext"
import { Button } from "@/components/ui/button"
import { ArrowLeft, List } from "lucide-react"
import { useState } from "react"
import DButton from "@/components/ui/DButton"

export default function BotSelector() {
  const t = useTranslations("Contact.Chatbot")
  const { chatData, sendMessageToBot, isSendingMessage } = useChat()
  const [isOpen, setIsOpen] = useState(false)
  const lastMessage =
    chatData?.chat?.messages[chatData.chat.messages.length - 1]

  if (!lastMessage?.needUserSelectBot) {
    return null
  }

  const handleOptionSelect = async (option) => {
    setIsOpen(false)

    await sendMessageToBot(option.value, true)
  }

  return (
    <div className="relative mb-4">
      {isOpen && (
        <div className="px-4">
          <div className="px-4 bottom-full left-0 right-0 bg-background p-4 border border-gray-300 rounded-lg shadow-lg">
            {lastMessage.botQuerySelectionOptions.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start border-b rounded-none border-gray-200 last:border-b-0 text-left whitespace-normal break-words py-3"
                onClick={() => handleOptionSelect(option)}
                disabled={isSendingMessage}
              >
                <span className="line-clamp-2">{t(option.transKey)}</span>
              </Button>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-white border border-gray-300"
              disabled={isSendingMessage}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("bot.selector.cancel")}
            </Button>
          </div>
        </div>
      )}
      {!isOpen && (
        <div className="px-4">
          <DButton
            isMain
            styles="p-5"
            onClickBtn={() => setIsOpen(true)}
            isLoading={isSendingMessage}
          >
            <List className="mr-2 h-4 w-4" />
            {t("bot.selector.selectOption")}
          </DButton>
        </div>
      )}
    </div>
  )
}
