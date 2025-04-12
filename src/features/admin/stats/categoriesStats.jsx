"use client"

import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import { TrendingUp, BarChart3 } from "lucide-react"
import {
  getCategoriesStats,
  formatCurrency,
} from "@/features/admin/stats/services/statsFrontService"
import { useTranslations, useLocale } from "next-intl"
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

export default function CategoriesStats() {
  const t = useTranslations("Admin.Stats.Categories")
  const locale = useLocale()
  const { data, isLoading, error } = useQuery({
    queryKey: ["categoriesStats"],
    queryFn: () => getCategoriesStats(),
  })

  if (error) {
    return <ErrorFront />
  }

  const getLocalizedValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return value[locale] || value.en || ""
    }

    return value
  }
  const stockStats = data?.stockStats || []
  const salesStats = data?.salesStats || []
  const totalCategories = data?.totalCategories || 0
  const averageStockPerCategory = data?.averageStockPerCategory || 0

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title={t("totalCategories")}
          value={totalCategories}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("averageStockPerCategory")}
          value={Math.round(averageStockPerCategory)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Camembert
          data={stockStats.map((item) => ({
            name: getLocalizedValue(item.categorie?.label) || "Unknown",
            value: item.totalStock,
          }))}
          title={t("stockByCategory")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
        <Camembert
          data={salesStats.map((item) => ({
            name: getLocalizedValue(item.categorie?.label) || "Unknown",
            value: item.totalSales,
          }))}
          title={t("salesByCategory")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("stockByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.category")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.stock")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("table.value")}
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
                  stockStats.map((stat) => (
                    <TableRow key={stat._id}>
                      <TableCell>
                        {getLocalizedValue(stat.categorie?.label) || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.totalStock}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(stat.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("salesByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.category")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.sales")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("table.revenue")}
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
                  salesStats.map((stat) => (
                    <TableRow key={stat._id}>
                      <TableCell>
                        {getLocalizedValue(stat.categorie?.label) || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.totalSales}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(stat.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
