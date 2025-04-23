"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { getStatusColor } from "@/features/user/business/orders/utils/userOrder"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import { ArrowRight, CheckCircle2, FileText } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import ErrorFront from "@/components/navigation/error"
import SuccessCheckoutSkeleton from "@/features/shop/checkout/SuccessCheckoutSkeleton"
import { useTitle } from "@/components/navigation/titleContext"

export default function SuccessCheckout() {
  const t = useTranslations("Shop.Checkout")
  const { Id: orderId } = useParams()
  const router = useRouter()
  const { setTitle } = useTitle()
  setTitle(t("titleSuccess"))
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/dashboard/business/orders/${orderId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }

      return response.json()
    },
  })
  const { mutateAsync: fetchInvoice, isPending: isFetchingInvoice } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          `/api/user/dashboard/business/invoices/${order.stripe.invoiceId}`
        )
        const data = await response.json()
        window.open(data.invoiceUrl, "_blank")
      },
    })

  if (isLoading) {
    return <SuccessCheckoutSkeleton />
  }

  if (!order) {
    return <ErrorFront />
  }

  const hasSubscription = order.stripe?.subscriptionId && order.subscription

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-green-600">
          {t("orderSuccess")}
        </h1>
        <p className="text-lg text-gray-600">{t("orderSuccessMessage")}</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <h2 className="font-semibold text-xl mb-2">
                {t("orderInformation")}
              </h2>
              <div className="flex justify-center md:justify-start mb-2">
                <Badge className={`${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </Badge>
              </div>
              <p className="text-gray-600">
                {t("orderId")}: <span className="font-medium">{order._id}</span>
              </p>
              <p className="text-gray-600">
                {t("date")}:{" "}
                <span className="font-medium">
                  {format(new Date(order.createdAt), "PPP")}
                </span>
              </p>
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-semibold text-xl mb-2">
                {t("billingAddress")}
              </h2>
              {order.billingAddress ? (
                <div className="space-y-1">
                  <p className="text-gray-600">{order.billingAddress.name}</p>
                  <p className="text-gray-600">{order.billingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.billingAddress.zipCode} {order.billingAddress.city}
                  </p>
                  <p className="text-gray-600">
                    {order.billingAddress.country}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noBillingAddress")}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
              <Button
                variant="outline"
                onClick={() => fetchInvoice()}
                className="w-full md:w-auto"
              >
                {isFetchingInvoice ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {t("downloadInvoice")}
              </Button>
              <Button
                onClick={() => router.push("/user/dashboard/business/orders")}
                className="w-full md:w-auto"
              >
                {t("viewAllOrders")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {hasSubscription && (
            <div className="space-y-4 text-center md:text-left">
              <h2 className="font-semibold text-xl">
                {t("subscriptionInformation")}
              </h2>
              <div className="flex justify-center md:justify-start">
                <Badge
                  className={getSubscriptionStatusColor(
                    order.subscription.stripe.status
                  )}
                >
                  {t(`subscriptionStatus.${order.subscription.stripe.status}`)}
                </Badge>
              </div>
              <p className="text-gray-600">
                {t("billingPeriod")}:{" "}
                <span className="font-medium">
                  {format(
                    new Date(order.subscription.stripe.periodStart),
                    "PPP"
                  )}{" "}
                  -{" "}
                  {format(new Date(order.subscription.stripe.periodEnd), "PPP")}
                </span>
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/user/dashboard/business/subscriptions/${order.subscription._id}`
                  )
                }
                className="w-full md:w-auto"
              >
                {t("viewSubscription")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h2 className="font-semibold text-xl mb-4 text-center md:text-left">
          {t("products")}
        </h2>
        <div className="space-y-4">
          {order.products.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-center border-b pb-4 text-center md:text-left"
            >
              <div className="mb-2 md:mb-0">
                <p className="font-medium">{item.productId.label.en}</p>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.quantity} | {t("billingCycle")}:{" "}
                  {item.billingCycle}
                </p>
              </div>
              <p className="font-medium">{item.price}€</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">{t("subtotal")}</p>
              <p>{order.stripe.amountSubtotal}€</p>
            </div>
            {order.stripe.amountTax > 0 && (
              <div className="flex justify-between">
                <p className="text-gray-600">{t("tax")}</p>
                <p>{order.stripe.amountTax}€</p>
              </div>
            )}
            {order.stripe.amountDiscount > 0 && (
              <div className="flex justify-between">
                <p className="text-gray-600">{t("discount")}</p>
                <p>-{order.stripe.amountDiscount}€</p>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2">
              <p>{t("total")}</p>
              <p>{order.stripe.amountTotal}€</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/shop/products")}
          className="w-full md:w-auto"
        >
          {t("continueShopping")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
