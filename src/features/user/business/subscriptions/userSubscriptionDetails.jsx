"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import {
  getSubscriptionStatusColor,
  fetchSubscriptionDetails,
  updateSubscription,
} from "@/features/user/business/subscriptions/utils/subscription"
import ErrorFront from "@/components/navigation/error"
import OrderDetailsSkeleton from "@/features/user/business/orders/orderDetailsSkeleton"
import { useState } from "react"
import toast from "react-hot-toast"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { AnimatedReload } from "@/components/actions/AnimatedReload"

export default function SubscriptionDetails() {
  const t = useTranslations("User.Business.Subscriptions.SubscriptionDetails")
  const { Id: subscriptionId } = useParams()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const queryClient = useQueryClient()
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => fetchSubscriptionDetails(subscriptionId),
  })
  const { mutateAsync: fetchInvoice, isPending: isFetchingInvoice } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/user/dashboard/business/invoices/${subscription.stripe.latestInvoiceId}`
        )
        const data = await response.json()

        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, "_blank")
        } else {
          toast.error(t("invoiceNotFound"))
        }
      },
    })
  const updateMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription", subscriptionId])
      toast.success(t("updateSuccess"))
      setShowCancelDialog(false)
    },
    onError: () => {
      toast.error(t("updateError"))
    },
  })

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (error) {
    return <ErrorFront />
  }

  if (!subscription) {
    return <ErrorFront />
  }

  const openInvoice = async () => {
    await fetchInvoice()
  }
  const handleAction = (action) => {
    updateMutation.mutate({
      subscriptionId,
      action,
    })
  }
  const canCancel = subscription.stripe.status === "active"

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Badge
              className={getSubscriptionStatusColor(subscription.stripe.status)}
            >
              {t(`Status.${subscription.stripe.status}`)}
            </Badge>
            <h2 className="font-semibold mb-2">
              {t("subscriptionInformation")}
            </h2>
            <p>
              {t("subscriptionId")}: {subscription._id}
            </p>
            <p>
              {t("periodStart")}:{" "}
              {format(new Date(subscription.stripe.periodStart), "PPP")}
            </p>
            <p>
              {t("periodEnd")}:{" "}
              {format(new Date(subscription.stripe.periodEnd), "PPP")}
            </p>
            {subscription.stripe.canceledAt && (
              <p>
                {t("canceledAt")}:{" "}
                {format(new Date(subscription.stripe.canceledAt), "PPP")}
              </p>
            )}
          </div>
          <div>
            <Button variant="outline" onClick={openInvoice}>
              {isFetchingInvoice ? (
                <AnimatedReload />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              {t("openInvoice")}
            </Button>
            <h2 className="font-semibold mb-2">{t("customerInformation")}</h2>
            <p>
              {t("name")}: {subscription.user.firstName}{" "}
              {subscription.user.lastName}
            </p>
            <p>
              {t("email")}: {subscription.user.email}
            </p>
            <p>
              {t("customerId")}: {subscription.stripe.customerId}
            </p>
            {subscription.stripe.defaultPaymentMethod && (
              <p>
                {t("defaultPaymentMethod")}:{" "}
                {subscription.stripe.defaultPaymentMethod}
              </p>
            )}
          </div>
        </div>
        {canCancel && (
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              {t("cancelSubscription")}
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">{t("products")}</h2>
        <div className="space-y-4">
          {subscription.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-medium">{item.productId.label.en}</p>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.stripe.quantity} | {t("billingCycle")}:{" "}
                  {item.billingCycle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {t("stripePriceId")}: {item.stripe.priceId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("cancelSubscriptionTitle")}</DialogTitle>
            <DialogDescription>
              {t("cancelSubscriptionDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              {subscription.stripe.canceledAt && (
                <Card className="p-2 border-orange-500 mb-4">
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    {t("cancelAtPeriodEndDescription2")}
                  </p>
                </Card>
              )}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleAction("cancel_at_period_end")}
                disabled={
                  updateMutation.isPending || subscription.stripe.canceledAt
                }
              >
                {t("cancelAtPeriodEnd")}
              </Button>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {t("cancelAtPeriodEndDescription")}
              </p>
              <Separator className="my-4" />
            </div>

            <Button
              className="w-full"
              variant="destructive"
              onClick={() => handleAction("cancel_immediately")}
              disabled={updateMutation.isPending}
            >
              {t("cancelNow")}
            </Button>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t("cancelNowDescription")}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
              disabled={updateMutation.isPending}
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
