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
import AdminOrderTreatment from "@/features/admin/business/orders/adminOrderTreatment"
import AdminOrderDetailsSkeleton from "@/features/admin/business/orders/AdminOrderDetailsSkeleton"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import toast from "react-hot-toast"
import { formatIdForDisplay, trimString } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function AdminOrderDetails() {
  const t = useTranslations("Admin.Business.Orders.OrderDetails")
  const { Id } = useParams()
  const router = useRouter()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", Id],
    queryFn: () => fetchOrderDetails(Id),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (isLoading) {
    return <AdminOrderDetailsSkeleton />
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
  const handleCancelOrder = async (action) => {
    try {
      setIsCancelling(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/business/orders/${Id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      await refetch()
      toast.success(t("cancelSuccess"))
      setShowCancelDialog(false)
    } catch (errorCancelOrder) {
      toast.error(`${t("cancelError")} : ${errorCancelOrder.message || ""}`)
    } finally {
      setIsCancelling(false)
    }
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
              {t("orderId")}: #{formatIdForDisplay(order)}
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

            <h2 className="font-semibold mb-2 mt-2">{t("billingAddress")}</h2>
            {order.billingAddress ? (
              <div className="space-y-1">
                <p>{order.billingAddress.name}</p>
                <p>{order.billingAddress.street}</p>
                <p>
                  {order.billingAddress.zipCode} {order.billingAddress.city}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{t("noBillingAddress")}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold mb-2">{t("orderActions")}</h2>
            <Button variant="outline" size="sm" onClick={openInvoice}>
              {t("openUserInvoice")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(`/admin/business/customers/${order.user._id}`)
              }}
            >
              {t("viewCustomer")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={openOrderStripe}>
              {t("goToOrderStripe")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {order.orderStatus !== "CANCEL" &&
              order.orderStatus !== "REFUND" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowCancelDialog(true)}
                >
                  {t("cancelOrder")}
                </Button>
              )}
          </div>
        </div>
      </Card>

      <div
        className={
          order.orderStatus !== "COMPLETED" &&
          order.orderStatus !== "CANCEL" &&
          order.orderStatus !== "REFUND"
            ? "grid grid-cols-2 gap-4"
            : ""
        }
      >
        {order.orderStatus !== "COMPLETED" &&
          order.orderStatus !== "CANCEL" &&
          order.orderStatus !== "REFUND" && (
            <AdminOrderTreatment
              order={order}
              orderId={Id}
              fetchOrderDetails={fetchOrderDetails}
            />
          )}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">{t("paymentInformation")}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p>{t("subtotal")}</p>
              <p className="text-gray-600">{order.stripe.amountSubtotal}€</p>
            </div>
            {order.stripe.amountTax !== undefined &&
              order.stripe.amountTax !== null && (
                <div className="flex justify-between items-center">
                  <p>{t("tax")}</p>
                  <p className="text-gray-600">{order.stripe.amountTax}€</p>
                </div>
              )}
            {order.stripe.amountDiscount && (
              <div className="flex justify-between items-center">
                <p>{t("discount")}</p>
                <p className="text-gray-600">-{order.stripe.amountDiscount}€</p>
              </div>
            )}
            {order.stripe.voucherCode && (
              <div className="flex justify-between items-center">
                <p>{t("voucher")}</p>
                <p className="text-gray-600">{order.stripe.voucherCode}</p>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{t("total")}</p>
                <p className="font-semibold">{order.stripe.amountTotal}€</p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>{t("currency")}</p>
                <p>{order.stripe.currency.toUpperCase()}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p>{t("sessionId")}</p>
                <p className="text-sm text-gray-600">
                  {trimString(order.stripe.sessionId, 40)}
                </p>
              </div>
              {order.stripe.paymentIntentId && (
                <div className="flex justify-between items-center mt-2">
                  <p>{t("paymentIntentId")}</p>
                  <p className="text-sm text-gray-600">
                    {trimString(order.stripe.paymentIntentId, 40)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {hasSubscription && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-semibold">{t("subscriptionInformation")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(
                  `/admin/business/subscriptions/${order.subscription._id}`
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
        <h2 className="font-semibold mb-4">{t("statusHistory")}</h2>
        <div className="space-y-4">
          {order.statusHistory
            .slice()
            .reverse()
            .map((status, index) => (
              <div key={index} className="flex items-center border-b pb-4">
                <div className="border-r pr-4">
                  {order.statusHistory.length - index}
                </div>
                <div className="flex justify-between items-center w-full ml-4">
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
              </div>
            ))}
        </div>
      </Card>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("cancelOrderTitle")}</DialogTitle>
            <DialogDescription>
              {hasSubscription
                ? t("cancelOrderSubscriptionDescription")
                : t("cancelOrderDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {hasSubscription ? (
              <>
                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  variant="outline"
                  onClick={() => handleCancelOrder("cancel_without_refund")}
                  disabled={isCancelling}
                >
                  {isCancelling ? <AnimatedReload /> : t("cancelWithoutRefund")}
                </Button>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {t("cancelWithoutRefundDescription")}
                </p>
                <Separator className="my-4" />
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/admin/business/subscriptions/${order.subscription._id}`
                    )
                  }
                >
                  {t("goToSubscriptionPage")}
                </Button>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {t("goToSubscriptionPageDescription")}
                </p>
              </>
            ) : (
              <>
                {order.stripe.paymentIntentId ? (
                  <>
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => handleCancelOrder("cancel_with_refund")}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <AnimatedReload />
                      ) : (
                        t("cancelWithRefund")
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 mt-1 text-center">
                      {t("cancelWithRefundDescription")}
                    </p>
                    <Separator className="my-4" />
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                    <p className="text-sm text-yellow-800 text-center">
                      {t("noRefundAvailable")}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleCancelOrder("cancel_without_refund")}
                  disabled={isCancelling}
                >
                  {isCancelling ? <AnimatedReload /> : t("cancelWithoutRefund")}
                </Button>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {t("cancelWithoutRefundDescription")}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCancelling}
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
