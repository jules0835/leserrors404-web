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
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import ErrorFront from "@/components/navigation/error"
import { useState } from "react"
import toast from "react-hot-toast"
import { Separator } from "@/components/ui/separator"
import {
  fetchSubscriptionDetails,
  updateSubscription,
} from "@/features/admin/business/subscriptions/utils/subscription"
import { ArrowRight } from "lucide-react"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { useRouter } from "@/i18n/routing"
import AdminSubscriptionDetailsSkeleton from "@/features/admin/business/subscriptions/AdminSubscriptionDetailsSkeleton"
import { formatIdForDisplay } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function AdminSubscriptionDetails() {
  const t = useTranslations("Admin.Business.Subscriptions.SubscriptionDetails")
  const { Id: subscriptionId } = useParams()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setTitle } = useTitle()
  setTitle(t("title"))
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
    return <AdminSubscriptionDetailsSkeleton />
  }

  if (error) {
    return <ErrorFront />
  }

  if (!subscription) {
    return <ErrorFront />
  }

  const handleAction = (action) => {
    updateMutation.mutate({
      subscriptionId,
      action,
    })
  }
  const openInvoice = async () => {
    await fetchInvoice()
  }
  const openSubscriptionStripe = () => {
    window.open(
      `https://dashboard.stripe.com/search?query=${subscription.stripe.subscriptionId}`,
      "_blank"
    )
  }
  const canCancel =
    subscription.stripe.status === "active" ||
    subscription.stripe.status === "preCanceled"

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4 md:mb-0">
            <Badge
              className={getSubscriptionStatusColor(subscription.stripe.status)}
            >
              {t(`Status.${subscription.stripe.status}`)}
            </Badge>
            <h2 className="font-semibold mb-2 mt-2">
              {t("subscriptionInformation")}
            </h2>
            <p className="mb-1">
              {t("subscriptionId")}: #{formatIdForDisplay(subscription)}
            </p>
            <p className="mb-1">
              {t("periodStart")}:{" "}
              {format(new Date(subscription.stripe.periodStart), "PPP")}
            </p>
            <p className="mb-1">
              {t("periodEnd")}:{" "}
              {format(new Date(subscription.stripe.periodEnd), "PPP")}
            </p>
            {subscription.stripe.canceledAt && (
              <p className="mb-1">
                {t("canceledAt")}:{" "}
                {format(new Date(subscription.stripe.canceledAt), "PPP")}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold mb-2">{t("customerInformation")}</h2>
            <p className="mb-1">
              {t("name")}: {subscription.user.firstName}{" "}
              {subscription.user.lastName}
            </p>
            <p className="mb-1">
              {t("email")}: {subscription.user.email}
            </p>
            <p className="mb-1">
              {t("customerId")}: #{subscription.stripe.customerId}
            </p>
            {subscription.stripe.defaultPaymentMethod && (
              <p className="mb-1">
                {t("defaultPaymentMethod")}:{" "}
                {subscription.stripe.defaultPaymentMethod}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold mb-2">{t("manageSubscription")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(
                  `/admin/business/orders/${subscription.orderId._id}`
                )
              }}
              className="w-full md:w-auto"
            >
              {t("viewOrder")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(
                  `/admin/business/customers/${subscription.user._id}`
                )
              }}
              className="w-full md:w-auto"
            >
              {t("viewCustomer")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={openInvoice}
              size="sm"
              className="w-full md:w-auto"
            >
              {t("openInvoice")}
              {isFetchingInvoice ? (
                <AnimatedReload />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={openSubscriptionStripe}
              size="sm"
              className="w-full md:w-auto"
            >
              {t("openSubscriptionStripe")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                size="sm"
                className="w-full md:w-auto"
              >
                {t("cancelSubscription")}
              </Button>
            )}
          </div>
        </div>
        {subscription.stripe.status === "preCanceled" && (
          <p className="mt-4 first-line:text-sm text-orange-500 text-center border-t pt-4">
            {t("preCanceledDescription")}
          </p>
        )}
      </Card>

      <Card className="p-4 md:p-6">
        <h2 className="font-semibold mb-4">{t("products")}</h2>
        <div className="space-y-4">
          {subscription.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-medium">{item.productId.label.en}</p>
                <p className="text-sm text-gray-500">
                  {t("quantity")}: {item.stripe.quantity} | {t("billingCycle")}:{" "}
                  {item.billingCycle}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">
                  {t("stripePriceId")}: {item.stripe.priceId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h2 className="font-semibold mb-4">{t("statusHistory")}</h2>
        <div className="space-y-4">
          {subscription.statusHistory
            .slice()
            .reverse()
            .map((status, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center border-b pb-4"
              >
                <div className="border-r pr-4 mb-2 sm:mb-0">
                  {subscription.statusHistory.length - index}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full ml-0 sm:ml-4">
                  <div className="mb-2 sm:mb-0">
                    <Badge
                      className={getSubscriptionStatusColor(status.status)}
                    >
                      {t(`Status.${status.status}`)}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      {t("changedBy")}: {status.updatedBy}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
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
        <DialogContent className="w-full max-w-md mx-auto">
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
              onClick={() => handleAction("cancel_now_with_remaining_refund")}
              disabled={updateMutation.isPending}
            >
              {t("cancelNowWithRemainingRefund")}
            </Button>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t("cancelNowWithRemainingRefundDescription")}
            </p>
            <Separator className="my-4" />

            <Button
              className="w-full"
              variant="destructive"
              onClick={() => handleAction("cancel_now_with_full_refund")}
              disabled={updateMutation.isPending}
            >
              {t("cancelNowWithFullRefund")}
            </Button>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t("cancelNowWithFullRefundDescription")}
            </p>
            <Separator className="my-4" />

            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleAction("cancel_now_without_refund")}
              disabled={updateMutation.isPending}
            >
              {t("cancelNowWithoutRefund")}
            </Button>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {t("cancelNowWithoutRefundDescription")}
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
