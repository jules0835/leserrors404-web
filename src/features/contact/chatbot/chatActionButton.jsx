import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { Package, CreditCard } from "lucide-react"
import SelectOrder from "@/features/contact/chatbot/actions/selectOrder"
import SelectSubscription from "@/features/contact/chatbot/actions/selectSubscription"

const actionIcons = {
  SELECT_ORDER: Package,
  SELECT_SUBSCRIPTION: CreditCard,
}
const actionComponents = {
  SELECT_ORDER: SelectOrder,
  SELECT_SUBSCRIPTION: SelectSubscription,
}

export default function ChatActionButton({
  action,
  onActionComplete,
  isDisabled,
  isLoading,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Contact.Chatbot.Actions")
  const Icon = actionIcons[action]
  const handleActionComplete = (selectedValue) => {
    onActionComplete(selectedValue)
    setIsOpen(false)
  }
  const ActionComponent = actionComponents[action]

  return (
    <>
      <DButton
        isMain
        styles="gap-2"
        onClickBtn={() => setIsOpen(true)}
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        <Icon size={18} />
        {t(`${action}.buttonText`)}
      </DButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(`${action}.title`)}</DialogTitle>
          </DialogHeader>
          <ActionComponent onSelect={handleActionComplete} />
        </DialogContent>
      </Dialog>
    </>
  )
}
