"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { getStatusColor } from "@/features/user/business/orders/utils/userOrder"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight } from "lucide-react"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestOrders } from "@/features/admin/dashboard/service/statsFrontService"
import ErrorFront from "@/components/navigation/error"
import { Button } from "@/components/ui/button"

export default function AdminDashboardOrder() {
  const t = useTranslations("Admin.Business.Orders")
  const router = useRouter()
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardLatestOrders"],
    queryFn: getLatestOrders,
  })

  if (error) {
    return <ErrorFront />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("latestOrders")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("customer")}</TableHead>
                <TableHead>{t("status.title")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-1 w-full space-y-7">
                    <DataGridSkeleton rows={1} cells={4} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.orders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t("noOrders")}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                data?.orders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.user.firstName} {order.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.orderStatus
                        )} text-white`}
                      >
                        {t(`Status.${order.orderStatus.toLowerCase()}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {order.stripe.amountTotal.toFixed(2)}{" "}
                      {order.stripe.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/business/orders/${order._id}`)
                        }
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
