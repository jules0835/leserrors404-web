import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function ChatInput() {
  const [message, setMessage] = useState("")
  const { refetch } = useChat()
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/contact/chatbot/message", { message })
    },
    onSuccess: () => {
      setMessage("")
      refetch()
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault()

    if (message.trim()) {
      mutate()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 border-t"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrire un message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
