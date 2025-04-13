"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  getBackgroundColor,
  getLogLevelTitle,
} from "@/features/admin/security/logs/utils/logs"
import { cn } from "@/lib/utils"
import { getLatestLogs } from "@/features/admin/dashboard/service/statsFrontService"

export default function AdminDashboardLogs() {
  const t = useTranslations("Admin.Security.Logs")
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardLatestLogs"],
    queryFn: getLatestLogs,
  })

  if (error) {
    return <ErrorFront />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("latestLogs")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("logLevel")}</TableHead>
                <TableHead>{t("message")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="h-1 w-full space-y-7">
                    <DataGridSkeleton rows={1} cells={3} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.logs?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                data?.logs?.map((log) => (
                  <TableRow
                    key={log._id}
                    className={cn(getBackgroundColor(log.logLevel))}
                  >
                    <TableCell>
                      {format(new Date(log.date), "PPp", { locale: fr })}
                    </TableCell>
                    <TableCell>{getLogLevelTitle(log.logLevel, t)}</TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
