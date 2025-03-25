"use client"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { format } from "date-fns"
import {
  fetchOrderDetails,
  getStatusColor,
} from "@/features/user/business/orders/utils/userOrder"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import ErrorFront from "@/components/navigation/error"
import OrderDetailsSkeleton from "@/features/user/business/orders/orderDetailsSkeleton"

export default function AdminOrderDetails() {
  const t = useTranslations("User.Business.Orders.OrderDetails")
  const { Id: orderId } = useParams()
  const router = useRouter()
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
  })

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (error) {
    return <ErrorFront />
  }

  if (!order) {
    return <ErrorFront />
  }

  const hasSubscription = order.stripe?.subscriptionId && order.subscription
  const openInvoice = async () => {
    const invoiceUrl = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user/dashboard/business/invoices/${order.stripe.invoiceId}`
    )
    const data = await invoiceUrl.json()
    window.open(data.invoiceUrl, "_blank")
  }
  const openOrderStripe = () => {
    window.open(
      `https://dashboard.stripe.com/search?query=${order.stripe.invoiceId}`,
      "_blank"
    )
  }
  const cancelOrder = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/business/orders/${orderId}/cancel`
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Badge className={getStatusColor(order.orderStatus)}>
              {order.orderStatus}
            </Badge>
            <h2 className="font-semibold mb-2">{t("orderInformation")}</h2>
            <p>
              {t("orderId")}: {order._id}
            </p>
            <p>
              {t("date")}: {format(new Date(order.createdAt), "PPP")}
            </p>
            <p>
              {t("email")}: {order.userEmail}
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-2">{t("customerInformation")}</h2>
            <p>
              {t("name")}: {order.user.firstName} {order.user.lastName}
            </p>
            <p>
              {t("email")}: {order.user.email}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold mb-2">{t("orderActions")}</h2>
            <Button variant="outline" size="sm" onClick={openInvoice}>
              {t("openUserInvoice")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={openOrderStripe}>
              {t("goToOrderStripe")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={cancelOrder}>
              {t("cancelOrder")}
            </Button>
          </div>
        </div>
      </Card>

      {hasSubscription && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-semibold">{t("subscriptionInformation")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(
                  `/user/dashboard/business/subscriptions/${order.subscription._id}`
                )
              }
            >
              {t("viewSubscription")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p>{t("subscriptionId")}</p>
              <p className="text-gray-600">{order.stripe.subscriptionId}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>{t("subscriptionStatus")}</p>
              <Badge
                className={getSubscriptionStatusColor(
                  order.subscription.stripe.status
                )}
              >
                {t(`subscriptionStatus.${order.subscription.stripe.status}`)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <p>{t("billingPeriod")}</p>
              <p className="text-gray-600">
                {format(new Date(order.subscription.stripe.periodStart), "PPP")}{" "}
                - {format(new Date(order.subscription.stripe.periodEnd), "PPP")}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="font-semibold mb-4">{t("products")}</h2>
        <div className="space-y-4">
          {order.products.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-medium">{item.productId.label.en}</p>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.quantity} | {t("billingCycle")}:{" "}
                  {item.billingCycle}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.price}€</p>
                <p className="text-sm text-gray-500">
                  {t("stripePriceId")}: {item.stripePriceId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">{t("paymentInformation")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              {t("totalAmount")}: {order.stripe.amountTotal}€
            </p>
            <p>
              {t("currency")}: {order.stripe.currency.toUpperCase()}
            </p>
            <p>
              {t("sessionId")}: {order.stripe.sessionId}
            </p>
          </div>
          <div>
            {order.stripe.paymentIntentId && (
              <p>
                {t("paymentIntentId")}: {order.stripe.paymentIntentId}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">{t("statusHistory")}</h2>
        <div className="space-y-4">
          {order.statusHistory.map((status, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <Badge className={getStatusColor(status.status)}>
                  {status.status}
                </Badge>
                <p className="text-sm text-gray-500">
                  {t("changedBy")}: {status.updatedBy}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {format(new Date(status.changedAt), "PPP p")}
                </p>
                {status.details && (
                  <p className="text-sm text-gray-500">{status.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
