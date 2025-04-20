"use client"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  getSalesStats,
  formatCurrency,
} from "@/features/admin/stats/services/statsFrontService"
import PeriodFilter from "@/features/admin/stats/components/PeriodFilter"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import { StatsChart } from "@/features/admin/stats/components/StatsChart"
import { Euro, ShoppingCart, TrendingUp, Package, Clock4 } from "lucide-react"
import { useTranslations } from "next-intl"
import ErrorFront from "@/components/navigation/error"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function SalesStats() {
  const t = useTranslations("Admin.Stats.Sales")
  const [filters, setFilters] = useState({
    period: "7d",
    groupBy: "day",
    productType: null,
    realTime: true,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["salesStats", filters],
    queryFn: () => getSalesStats(filters),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (error) {
    return <ErrorFront />
  }

  const totalSales =
    data?.stats.reduce((sum, item) => sum + item.totalSales, 0) || 0
  const totalOrders =
    data?.stats.reduce((sum, item) => sum + item.orderCount, 0) || 0
  const averageOrderValue = totalSales / (totalOrders || 1)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <PeriodFilter
          value={filters}
          onChange={(newFilters) =>
            setFilters({ ...newFilters, realTime: false })
          }
        />
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2",
            filters.realTime && "bg-primary text-primary-foreground"
          )}
          onClick={() =>
            setFilters({ ...filters, realTime: !filters.realTime })
          }
        >
          <Clock4 className="h-4 w-4" />
          {t("realTime")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("totalSales")}
          value={formatCurrency(totalSales)}
          icon={<Euro className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("totalOrders")}
          value={totalOrders}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("averageOrderValue")}
          value={formatCurrency(averageOrderValue)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("productsSold")}
          value={
            data?.stats.reduce((sum, item) => sum + item.products.length, 0) ||
            0
          }
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatsChart
          title={t("salesOverTime")}
          data={data?.stats || []}
          isLoading={isLoading}
          dataKey="totalSales"
          valueFormatter={formatCurrency}
        />
        <StatsChart
          title={t("ordersOverTime")}
          data={data?.stats || []}
          isLoading={isLoading}
          dataKey="orderCount"
          valueFormatter={(value) => value}
        />
      </div>
    </div>
  )
}
