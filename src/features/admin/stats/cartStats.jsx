"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  getCartStats,
  formatCurrency,
} from "@/features/admin/stats/services/statsFrontService"
import PeriodFilter from "@/features/admin/stats/components/PeriodFilter"
import { StatCard } from "@/features/admin/stats/components/StatCard"
import Camembert from "@/features/admin/stats/components/Camembert"
import { ShoppingCart, Package, TrendingUp, Clock4 } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
export default function CartStats() {
  const t = useTranslations("Admin.Stats.Carts")
  const locale = useLocale()
  const [filters, setFilters] = useState({
    period: "7d",
    realTime: true,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["cartStats", filters],
    queryFn: () => getCartStats(filters),
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
  const activeCarts = data?.activeCarts || {}
  const convertedCarts = data?.convertedCarts || {}
  const productDistribution = data?.productDistribution || []

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <PeriodFilter
          value={filters}
          onChange={(newFilters) =>
            setFilters({ ...newFilters, realTime: false })
          }
          showGroupBy={false}
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
          title={t("totalActiveCarts")}
          value={activeCarts.totalActiveCarts}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("totalConvertedCarts")}
          value={convertedCarts.totalConvertedCarts}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("avgPreOrderValue")}
          value={formatCurrency(activeCarts.avgPreOrderValue)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title={t("avgPostOrderValue")}
          value={formatCurrency(convertedCarts.avgPostOrderValue)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Camembert
          data={[
            {
              name: t("userCarts"),
              value: activeCarts.userCarts,
            },
            {
              name: t("guestCarts"),
              value: activeCarts.guestCarts,
            },
          ]}
          title={t("cartDistribution")}
          dataKey="value"
          nameKey="name"
          isLoading={isLoading}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("topProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.product")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.cartCount")}
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
                  productDistribution.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        {getLocalizedValue(product.productName)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.count}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.totalQuantity}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("preOrderStats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("totalValue")}</span>
                <span>{formatCurrency(activeCarts.totalPreOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalSubtotal")}</span>
                <span>{formatCurrency(activeCarts.totalPreOrderSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalTax")}</span>
                <span>{formatCurrency(activeCarts.totalPreOrderTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalDiscount")}</span>
                <span>{formatCurrency(activeCarts.totalPreOrderDiscount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("postOrderStats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("totalValue")}</span>
                <span>
                  {formatCurrency(convertedCarts.totalPostOrderValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalSubtotal")}</span>
                <span>
                  {formatCurrency(convertedCarts.totalPostOrderSubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalTax")}</span>
                <span>{formatCurrency(convertedCarts.totalPostOrderTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("totalDiscount")}</span>
                <span>
                  {formatCurrency(convertedCarts.totalPostOrderDiscount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
