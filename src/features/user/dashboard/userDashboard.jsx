"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, ShoppingCart, Ticket, Wallet } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { getUserDashboardData } from "./service/userDashboard"
import { getStatusColor } from "@/features/user/business/orders/utils/userOrder"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import { formatIdForDisplay, getLocalizedValue } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function UserDashboard() {
  const t = useTranslations("User.Dashboard")
  const locale = useLocale()
  const router = useRouter()
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data, isLoading, error } = useQuery({
    queryKey: ["userDashboard"],
    queryFn: getUserDashboardData,
  })

  if (error) {
    return <ErrorFront />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          onClick={() => router.push("/user/dashboard/business/orders")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalOrders")}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                data?.stats?.totalOrders
              )}
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          onClick={() => router.push("/user/dashboard/business/subscriptions")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeSubscriptions")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                data?.stats?.activeSubscriptions
              )}
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          onClick={() => router.push("/user/dashboard/support/tickets")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("activeTickets")}
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                data?.stats?.activeTickets
              )}
            </div>
          </CardContent>
        </Card>
        <Card
          className="transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
          onClick={() => router.push("/user/dashboard/business/payments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalSpent")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                `${data?.stats?.totalSpent} €`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orderId")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
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
                        <TableCell>#{formatIdForDisplay(order)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(order.orderStatus)} text-white`}
                          >
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.stripe.amountTotal / 100} €
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/user/dashboard/business/orders/${order._id}`
                              )
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

        <Card>
          <CardHeader>
            <CardTitle>{t("recentSubscriptions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
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
                  {!isLoading && data?.subscriptions?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        {t("noSubscriptions")}
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    data?.subscriptions?.map((subscription) => (
                      <TableRow key={subscription._id}>
                        <TableCell>
                          {getLocalizedValue(
                            subscription.items[0]?.productId?.label,
                            locale
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getSubscriptionStatusColor(
                              subscription.stripe.status
                            )} text-white`}
                          >
                            {subscription.stripe.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/user/dashboard/business/subscriptions/${subscription._id}`
                              )
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("activeTickets")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ticketId")}</TableHead>
                  <TableHead>{t("lastMessage")}</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
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
                {!isLoading && data?.tickets?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {t("noActiveTickets")}
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  data?.tickets?.map((ticket) => (
                    <TableRow key={ticket._id}>
                      <TableCell>#{formatIdForDisplay(ticket)}</TableCell>
                      <TableCell>
                        {new Date(
                          ticket.messages[ticket.messages.length - 1]?.sendDate
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/user/dashboard/support/tickets/${ticket._id}`
                            )
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
    </div>
  )
}
