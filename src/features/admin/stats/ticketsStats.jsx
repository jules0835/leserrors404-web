"use client"

import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import { MessageSquare, Bot, Clock, CheckCircle, Clock4 } from "lucide-react"
import {
  getTicketsStats,
  formatDuration,
} from "@/features/admin/stats/services/statsFrontService"
import { useTranslations } from "next-intl"
import ErrorFront from "@/components/navigation/error"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Camembert from "@/features/admin/stats/components/Camembert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PeriodFilter from "@/features/admin/stats/components/PeriodFilter"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function TicketsStats() {
  const t = useTranslations("Admin.Stats.Tickets")
  const [filters, setFilters] = useState({
    period: "7d",
    realTime: true,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["ticketsStats", filters.period, filters.realTime],
    queryFn: () => getTicketsStats(filters),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (error) {
    return <ErrorFront />
  }

  const formatTime = (ms) => {
    if (!ms) {
      return "0s"
    }

    return formatDuration(ms)
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("activeTickets")}
          value={data?.activeTickets || 0}
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("closedTickets")}
          value={data?.closedTickets || 0}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("botOnlyChats")}
          value={data?.botOnlyChats || 0}
          icon={<Bot className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("activeBotChats")}
          value={data?.activeBotChats || 0}
          icon={<Bot className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("responseTime")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <StatCard
              title={t("averageResponseTime")}
              value={formatTime(data?.avgResponseTime)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoading}
            />
            <StatCard
              title={t("minResolutionTime")}
              value={formatTime(data?.resolutionTimeStats?.minResolutionTime)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoading}
            />
            <StatCard
              title={t("maxResolutionTime")}
              value={formatTime(data?.resolutionTimeStats?.maxResolutionTime)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Camembert
          data={data?.closureDistribution?.map((item) => ({
            name: t(`closureBy.${item._id || "unknown"}`),
            value: item.count,
          }))}
          title={t("closureDistribution")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />

        <Camembert
          data={data?.ticketDistribution?.map((item) => ({
            name: t(`states.${item._id}`),
            value: item.count,
          }))}
          title={t("ticketDistribution")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("topUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.user")}</TableHead>
                    <TableHead>{t("table.email")}</TableHead>
                    <TableHead className="text-right">
                      {t("table.totalTickets")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("table.openTickets")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("table.closedTickets")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.topUsers?.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.userEmail}</TableCell>
                        <TableCell className="text-right">
                          {user.ticketCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.openTickets}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.closedTickets}
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
