"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const TREATMENT_STATUSES = {
  PAID: "PROCESSING",
  PROCESSING: "COMPLETED",
  PENDING: "PROCESSING",
}

export default function AdminOrderTreatment({ order, orderId }) {
  const t = useTranslations("Admin.Business.Orders.OrderDetails")
  const [orderStatusDescription, setOrderStatusDescription] = useState("")
  const [isSuspensionDialogOpen, setIsSuspensionDialogOpen] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const handleStatusUpdate = async (nextStatus) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/business/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            details: orderStatusDescription,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      await queryClient.invalidateQueries(["order", orderId])
      setOrderStatusDescription("")
      toast.success(t("statusUpdateSuccess"))
    } catch (error) {
      toast.error(`${t("statusUpdateError")} : ${error.message || ""}`)
    } finally {
      setIsLoading(false)
    }
  }
  const handleSuspendOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/business/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "PENDING",
            details: suspensionReason,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to suspend order")
      }

      await queryClient.invalidateQueries(["order", orderId])
      setIsSuspensionDialogOpen(false)
      setSuspensionReason("")
      toast.success(t("suspendOrderSuccess"))
    } catch (error) {
      toast.error(t("suspendOrderError"))
    } finally {
      setIsLoading(false)
    }
  }
  const nextStatus = TREATMENT_STATUSES[order.orderStatus]

  if (!nextStatus) {
    return null
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold mb-4">{t("orderTreatment")}</h2>
      {order.orderStatus === "PAID" && (
        <div>
          <h2 className="text-center mb-4">{t("orderPaidDescription")}</h2>
          <Textarea
            value={orderStatusDescription}
            onChange={(e) => setOrderStatusDescription(e.target.value)}
            className="resize-none"
            placeholder={t("orderAddComment")}
            required
          />
          <Button
            onClick={() => handleStatusUpdate(nextStatus)}
            className="w-full mt-4"
            disabled={!orderStatusDescription || isLoading}
          >
            {isLoading ? t("loading") : t("confirmOrder")}
          </Button>
        </div>
      )}

      {order.orderStatus === "PROCESSING" && (
        <div>
          <h2 className="text-center">
            {t("orderWaitingCompletionDescription")}
          </h2>
          <p className="text-sm mt-1 mb-4 text-center italic">
            {t("orderCompletionWarning")}
          </p>
          <Textarea
            value={orderStatusDescription}
            onChange={(e) => setOrderStatusDescription(e.target.value)}
            className="resize-none"
            placeholder={t("orderAddComment")}
            required
          />
          <Button
            onClick={() => handleStatusUpdate(nextStatus)}
            className="w-full mt-4"
            disabled={!orderStatusDescription || isLoading}
          >
            {isLoading ? t("loading") : t("markAsCompleted")}
          </Button>
        </div>
      )}

      {order.orderStatus === "PENDING" && (
        <div>
          <h2 className="text-center mb-4">{t("orderPendingDescription")}</h2>
          <Textarea
            value={orderStatusDescription}
            onChange={(e) => setOrderStatusDescription(e.target.value)}
            className="resize-none"
            placeholder={t("orderAddComment")}
            required
          />
          <Button
            onClick={() => handleStatusUpdate(nextStatus)}
            className="w-full mt-4"
            disabled={!orderStatusDescription || isLoading}
          >
            {isLoading ? t("loading") : t("resumeOrder")}
          </Button>
        </div>
      )}

      {order.orderStatus === "PROCESSING" && (
        <>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            size="sm"
            onClick={() => setIsSuspensionDialogOpen(true)}
            disabled={isLoading}
          >
            {t("suspendOrder")}
          </Button>
        </>
      )}

      <Dialog
        open={isSuspensionDialogOpen}
        onOpenChange={setIsSuspensionDialogOpen}
      >
        <DialogContent className="w-full max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{t("suspendOrderTitle")}</DialogTitle>
            <DialogDescription>
              {t("suspendOrderDescription")}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder={t("suspendOrderReasonPlaceholder")}
            required
          />
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsSuspensionDialogOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSuspendOrder}
              disabled={!suspensionReason || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? t("loading") : t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
