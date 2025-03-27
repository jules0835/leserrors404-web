import { useQuery, useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText } from "lucide-react"
import { format } from "date-fns"
import {
  fetchOrderDetails,
  getStatusColor,
} from "@/features/user/business/orders/utils/userOrder"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import ErrorFront from "@/components/navigation/error"
import OrderDetailsSkeleton from "@/features/user/business/orders/OrderDetailsSkeleton"
import { AnimatedReload } from "@/components/actions/AnimatedReload"

export default function OrderDetails() {
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
  const { mutateAsync: fetchInvoice, isPending: isFetchingInvoice } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/user/dashboard/business/invoices/${order.stripe.invoiceId}`
        )
        const data = await response.json()
        window.open(data.invoiceUrl, "_blank")
      },
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

  const openInvoice = async () => {
    await fetchInvoice()
  }
  const hasSubscription = order.stripe?.subscriptionId && order.subscription

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Badge className={getStatusColor(order.orderStatus)}>
              {order.orderStatus}
            </Badge>
            <h2 className="font-semibold">{t("orderInformation")}</h2>
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
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={openInvoice}>
              {isFetchingInvoice ? (
                <AnimatedReload />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {t("openInvoice")}
            </Button>
            <h2 className="font-semibold">{t("customerInformation")}</h2>
            <p>
              {t("name")}: {order.user.firstName} {order.user.lastName}
            </p>
            <p>
              {t("email")}: {order.user.email}
            </p>
          </div>
        </div>
      </Card>

      {hasSubscription && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
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
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p>{t("subscriptionId")}</p>
              <p className="text-gray-600">{order.subscription._id}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p>{t("status")}</p>
              <Badge
                className={getSubscriptionStatusColor(
                  order.subscription.stripe.status
                )}
              >
                {t(`subscriptionStatus.${order.subscription.stripe.status}`)}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p>{t("billingPeriod")}</p>
              <p className="text-gray-600">
                {format(new Date(order.subscription.stripe.periodStart), "PPP")}{" "}
                - {format(new Date(order.subscription.stripe.periodEnd), "PPP")}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold mb-4">{t("products")}</h2>
        <div className="space-y-4">
          {order.products.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4"
            >
              <div>
                <p className="font-medium">{item.productId.label.en}</p>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.quantity} | {t("billingCycle")}:{" "}
                  {item.billingCycle}
                </p>
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right">
                <p className="font-medium">{item.price}€</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold mb-4">{t("paymentInformation")}</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <p>{t("subtotal")}</p>
            <p className="text-gray-600">{order.stripe.amountSubtotal}€</p>
          </div>
          {order.stripe.amountTax !== undefined &&
            order.stripe.amountTax !== null && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <p>{t("tax")}</p>
                <p className="text-gray-600">{order.stripe.amountTax}€</p>
              </div>
            )}
          {order.stripe.amountDiscount && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p>{t("discount")}</p>
              <p className="text-gray-600">-{order.stripe.amountDiscount}€</p>
            </div>
          )}
          {order.stripe.voucherCode && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p>{t("voucher")}</p>
              <p className="text-gray-600">{order.stripe.voucherCode}</p>
            </div>
          )}
          <div className="border-t pt-3 mt-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <p className="font-semibold">{t("total")}</p>
              <p className="font-semibold">{order.stripe.amountTotal}€</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-sm text-gray-500">
              <p>{t("currency")}</p>
              <p>{order.stripe.currency.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
