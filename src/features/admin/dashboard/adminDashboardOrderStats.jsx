"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { StatsChart } from "@/features/admin/stats/components/StatsChart"
import ErrorFront from "@/components/navigation/error"
import { getOrderStats } from "@/features/admin/dashboard/service/statsFrontService"

export default function AdminDashboardOrderStats() {
  const t = useTranslations("Admin.Stats.Sales")
  const [filters] = useState({
    period: "7d",
    realTime: true,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardOrderStats", filters],
    queryFn: () => getOrderStats(filters.period, filters.realTime),
  })

  if (error) {
    return <ErrorFront />
  }

  return (
    <StatsChart
      data={data?.stats || []}
      isLoading={isLoading}
      dataKey="orderCount"
      valueFormatter={(value) => value}
      title={t("ordersOverTime")}
    />
  )
}
