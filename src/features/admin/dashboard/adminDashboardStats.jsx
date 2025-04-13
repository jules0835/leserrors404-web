import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import { ShoppingCart, Users, MessageSquare, CreditCard } from "lucide-react"
import { getDashboardStats } from "@/features/admin/dashboard/service/statsFrontService"
import { useTranslations } from "next-intl"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminDashboardStats() {
  const t = useTranslations("Admin.Dashboard")
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => getDashboardStats(),
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("errorTitle")}</AlertTitle>
        <AlertDescription>{t("errorDescription")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("todayOrders")}
        value={data?.todayOrders || 0}
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <StatCard
        title={t("todayRegistrations")}
        value={data?.todayRegistrations || 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <StatCard
        title={t("todayOpenTickets")}
        value={data?.todayOpenTickets || 0}
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
      <StatCard
        title={t("activeSubscriptions")}
        value={data?.activeSubscriptions || 0}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoading}
      />
    </div>
  )
}
