"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getSubscriptionsStats } from "@/features/admin/stats/services/statsFrontService"
import PeriodFilter from "@/features/admin/stats/components/PeriodFilter"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import Camembert from "@/features/admin/stats/components/Camembert"
import { Users, AlertCircle, Clock4 } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import ErrorFront from "@/components/navigation/error"
import { Button } from "@/components/ui/button"
import { cn, getLocalizedValue } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTitle } from "@/components/navigation/titleContext"

export default function SubscriptionsStats() {
  const t = useTranslations("Admin.Stats.Subscriptions")
  const locale = useLocale()
  const [filters, setFilters] = useState({
    period: "7d",
    realTime: true,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptionsStats", filters],
    queryFn: () => getSubscriptionsStats(filters),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (error) {
    return <ErrorFront />
  }

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <PeriodFilter
            value={filters}
            onChange={(newFilters) =>
              setFilters({ ...newFilters, realTime: false })
            }
            showGroupBy={false}
            disabled={filters.realTime}
          />
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 w-full sm:w-auto",
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
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t("totalSubscriptions")}
          value={data?.totalSubscriptions || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("activeSubscriptions")}
          value={data?.activeSubscriptions || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("canceledSubscriptions")}
          value={data?.canceledSubscriptions || 0}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Camembert
          data={data?.statusDistribution?.map((item) => ({
            name: t(`status.${item._id}`),
            value: item.count,
          }))}
          title={t("statusDistribution")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />

        <Camembert
          data={data?.billingCycleDistribution?.map((item) => ({
            name: t(`billingCycle.${item._id}`),
            value: item.count,
          }))}
          title={t("billingCycleDistribution")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("topProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.product")}</TableHead>
                    <TableHead className="text-right">
                      {t("table.subscriptionCount")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("table.totalQuantity")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.topProducts?.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          {getLocalizedValue(product.productName, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.subscriptionCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.totalQuantity}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
