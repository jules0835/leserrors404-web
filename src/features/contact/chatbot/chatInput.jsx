import { useState, useEffect, useRef, useCallback } from "react"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { updateUserTypingStatus } from "@/features/contact/chatbot/service/chatService"
import { AnimatedReload } from "@/components/actions/AnimatedReload"

export default function ChatInput() {
  const [message, setMessage] = useState("")
  const { sendMessageToAdmin, isSendingMessage, reloadChat } = useChat()
  const typingTimeoutRef = useRef(null)
  const debounceTimeoutRef = useRef(null)
  const handleTyping = useCallback((isTyping) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      try {
        await updateUserTypingStatus(isTyping)
      } catch (error) {
        if (error.response.status === 400) {
          reloadChat()
        }
      }

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          updateUserTypingStatus(false)
        }, 30000)
      }
    }, 500)
  }, [])

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    },
    []
  )

  const handleChange = (e) => {
    setMessage(e.target.value)
    handleTyping(true)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (message.trim()) {
      setMessage("")
      await sendMessageToAdmin(message)
      handleTyping(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-t"
      >
        <Input
          value={message}
          onChange={handleChange}
          placeholder="Écrire un message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isSendingMessage}>
          {isSendingMessage ? <AnimatedReload /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
