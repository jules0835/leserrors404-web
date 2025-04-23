"use client"

import AdminInboxSidebar from "@/features/admin/support/inbox/adminInboxSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MonitorSmartphone } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AdminInboxLayout({ children }) {
  const isMobile = useIsMobile()
  const t = useTranslations("admin.support.inbox")

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {isMobile ? (
        <div className="flex flex-1 overflow-hidden h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <MonitorSmartphone size={48} className="text-red-500" />
            <h1 className="text-2xl font-bold text-center mt-4">
              {t("noMobileSupport")}
            </h1>
            <p className="text-center mt-2">
              {t("noMobileSupportDescription")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden h-full">
          <AdminInboxSidebar />
          {children}
        </div>
      )}
    </div>
  )
}
