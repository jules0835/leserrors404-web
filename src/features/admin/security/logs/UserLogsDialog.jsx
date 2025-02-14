"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import UserLogsList from "./UserLogsList"
import { useTranslations } from "next-intl"

export default function UserLogsDialog({ userId, isOpen, onClose }) {
  const t = useTranslations("Admin.Security.Logs")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("userLogs")}</DialogTitle>
          <DialogDescription>{t("userLogsDescription")}</DialogDescription>
        </DialogHeader>
        <UserLogsList userId={userId} />
      </DialogContent>
    </Dialog>
  )
}
