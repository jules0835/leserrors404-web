"use client"

import AdminDashboardLogs from "@/features/admin/dashboard/adminDashboardLogs"
import AdminDashboardOrder from "@/features/admin/dashboard/adminDashboardOrder"
import AdminDashboardOrderStats from "@/features/admin/dashboard/adminDashboardOrderStats"
import AdminDashboardStats from "@/features/admin/dashboard/adminDashboardStats"
import AdminDashboardTickets from "@/features/admin/dashboard/adminDashboardTickets"
import { useSession } from "next-auth/react"
import { useTranslations } from "use-intl"
import { useTitle } from "@/components/navigation/titleContext"

export default function AdminDashboard() {
  const t = useTranslations("Admin.Dashboard")
  const { data: session } = useSession()
  const { setTitle } = useTitle()
  setTitle(t("title"))

  return (
    <div className="space-y-4 p-4">
      <div className="pb-4">
        <h1 className="text-2xl font-bold">
          {t("welcome", { userName: session?.user?.firstName })}
        </h1>
        <p className="text-sm text-muted-foreground">{t("welcomeMessage")}</p>
      </div>
      <div>
        <AdminDashboardStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminDashboardOrder />
        <AdminDashboardOrderStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminDashboardLogs />
        <AdminDashboardTickets />
      </div>
    </div>
  )
}
