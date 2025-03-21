import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  fetchOrderDetails,
  getStatusColor,
} from "@/features/user/business/orders/utils/userOrder"
import ErrorFront from "@/components/navigation/error"
import OrderDetailsSkeleton from "@/features/user/business/orders/OrderDetailsSkeleton"

export default function OrderDetails() {
  const t = useTranslations("User.Business.Orders.OrderDetails")
  const { Id: orderId } = useParams()
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </Card>

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
            {order.stripe.subscriptionId && (
              <p>
                {t("subscriptionId")}: {order.stripe.subscriptionId}
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
