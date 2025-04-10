"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MessagesSquare, Send } from "lucide-react"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import toast from "react-hot-toast"
import axios from "axios"
import { useChat } from "@/features/contact/chatbot/context/chatContext"

export default function UserNewTicket() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { openChat } = useChat()
  const t = useTranslations("User.Chat")
  const router = useRouter()
  const handleSendMessage = async () => {
    if (!message.trim()) {
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post(
        "/api/user/dashboard/support/inbox/new",
        {
          message: message.trim(),
        }
      )

      if (response.data.chatId) {
        router.push(`/user/dashboard/support/tickets/${response.data.chatId}`)
      }

      setIsDialogOpen(false)
      setMessage("")
    } catch (error) {
      toast.error(t("errorSendingMessage"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=" mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("getNeedHelp")}</h2>
        <p className="text-muted-foreground mb-4">{t("getNeedHelpDesc")}</p>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
          <MessagesSquare className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-lg font-medium mb-2">{t("chatNow")}</h3>
          <p className="text-muted-foreground mb-4">{t("chatNowDesc")}</p>
          <Button className="mt-auto" onClick={() => openChat()}>
            {t("chatNowBtn")}
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
          <Send className="h-10 w-10 mb-4 text-primary" />
          <h3 className="text-lg font-medium mb-2">{t("sendMessage")}</h3>
          <p className="text-muted-foreground mb-4">{t("sendMessageDesc")}</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="mt-auto"
            variant="outline"
          >
            {t("sendMessageBtn")}
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sendMessageToSupport")}</DialogTitle>
            <DialogDescription>
              {t("sendMessageToSupportDesc")}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messageToSupportPlaceholder")}
            className="min-h-[150px]"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? <AnimatedReload /> : t("send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
