"use client"

import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import { Package, TrendingUp, BarChart3 } from "lucide-react"
import {
  getProductsStats,
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
import { getLocalizedValue } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function ProductsStats() {
  const t = useTranslations("Admin.Stats.Products")
  const locale = useLocale()
  const { data, isLoading, error } = useQuery({
    queryKey: ["productsStats"],
    queryFn: () => getProductsStats(),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (error) {
    return <ErrorFront />
  }

  const stockStats = data?.stockStats || []
  const salesStats = data?.salesStats || []
  const totalStock = stockStats.reduce((sum, item) => sum + item.totalStock, 0)
  const totalValue = stockStats.reduce((sum, item) => sum + item.totalValue, 0)
  const totalSales = salesStats.reduce((sum, item) => sum + item.totalSales, 0)

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <StatCard
          title={t("totalStock")}
          value={totalStock}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("totalValue")}
          value={formatCurrency(totalValue)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("totalSales")}
          value={totalSales}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Camembert
          data={stockStats.slice(0, 8).map((item) => ({
            name: getLocalizedValue(item.product?.label, locale) || "Unknown",
            value: item.totalStock,
          }))}
          title={t("topStockedProducts")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
        <Camembert
          data={salesStats.slice(0, 8).map((item) => ({
            name: getLocalizedValue(item.product?.label, locale) || "Unknown",
            value: item.totalSales,
          }))}
          title={t("topSellingProducts")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("topStockedProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.product")}</TableHead>
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
                  stockStats.slice(0, 10).map((stat) => (
                    <TableRow key={stat._id}>
                      <TableCell>
                        {getLocalizedValue(stat.product?.label, locale)}
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
            <CardTitle>{t("topSellingProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.product")}</TableHead>
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
                  salesStats.slice(0, 10).map((stat) => (
                    <TableRow key={stat._id}>
                      <TableCell>
                        {getLocalizedValue(stat.product?.label, locale)}
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
