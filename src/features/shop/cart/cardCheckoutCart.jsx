import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, TicketPercent } from "lucide-react"
import { useTranslations } from "next-intl"
import TopCartMessages from "@/features/shop/cart/topCartMessages"
import {
  displayLoadingCalcul,
  returnError,
} from "@/features/shop/cart/utils/cart"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import DButton from "@/components/ui/DButton"
import { hasSubscriptions } from "@/features/shop/cart/utils/cartService"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useState } from "react"
import { useCart } from "@/features/shop/cart/context/cartContext"
import CartCheckoutSummary from "@/features/shop/cart/cartCheckoutSummary"

export default function CardCheckoutCart({
  cart,
  isLoading,
  session,
  isUpdating,
  setIsUpdating,
}) {
  const t = useTranslations("Shop.Cart")
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [isCheckoutSummaryOpen, setIsCheckoutSummaryOpen] = useState(false)
  const [saveCardForFuture, setSaveCardForFuture] = useState(true)
  const queryClient = useQueryClient()
  const { applyCartVoucher, removeCartVoucher } = useCart()
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      return
    }

    setIsApplyingVoucher(true)

    try {
      await applyCartVoucher(voucherCode)
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success(t("voucherApplied"))
    } catch (errorVoucher) {
      toast.error(errorVoucher.message || t("voucherError"))
    } finally {
      setIsApplyingVoucher(false)
      setVoucherCode("")
    }
  }
  const handleRemoveVoucher = async () => {
    try {
      setIsUpdating(true)
      await removeCartVoucher()
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      await queryClient.refetchQueries({ queryKey: ["cart"] })
    } catch (errorRm) {
      toast.error(`An error occurred, please try again.${errorRm}`)
    } finally {
      setIsUpdating(false)
    }
  }
  const handleCheckout = () => {
    setIsCheckoutSummaryOpen(true)
  }

  return (
    <Card className="p-6 sticky top-24">
      <div className="space-y-2">
        <TopCartMessages cart={cart} isLoading={isLoading} session={session} />
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">{t("orderSummary")}</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>
                {displayLoadingCalcul(
                  cart?.subtotal?.toFixed(2),
                  "16",
                  isUpdating,
                  isLoading
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("taxes")}</span>
              <span>
                {displayLoadingCalcul(
                  cart?.tax?.toFixed(2),
                  "16",
                  isUpdating,
                  isLoading
                )}
              </span>
            </div>

            <Separator />

            {cart?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t("discount")}</span>
                <span>
                  {displayLoadingCalcul(
                    `- ${cart?.discount?.toFixed(2)}`,
                    "20",
                    isUpdating,
                    isLoading
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold">
              <span>{t("total")}</span>
              <span>
                {displayLoadingCalcul(
                  cart?.total?.toFixed(2),
                  "24",
                  isUpdating,
                  isLoading
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {!cart?.voucher && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={t("voucherCode")}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                onClick={handleApplyVoucher}
                disabled={isApplyingVoucher || !voucherCode}
              >
                {t("apply")}
              </Button>
            </div>
          )}
          {cart?.voucher && isUpdating && <Skeleton className="w-full h-10" />}
          {cart?.voucher && !isUpdating && (
            <div className="flex justify-between items-center border rounded-md py-1 px-5">
              <TicketPercent />
              <span>{`${cart.voucher.code} - ${cart.voucher.type === "percentage" ? `${cart.voucher.amount}%` : `${cart.voucher.amount}€`}`}</span>
              <Button variant="ghost" size="icon" onClick={handleRemoveVoucher}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          {!isLoading && session && (
            <TooltipProvider>
              {!cart?.checkout?.isEligible && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DButton
                        isMain
                        isDisabled={
                          cart?.products?.length === 0 ||
                          !cart?.checkout?.isEligible
                        }
                        onClickBtn={handleCheckout}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {t("checkout")}
                      </DButton>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {returnError(t, cart?.checkout?.reason) ||
                      t("cantCheckout")}
                  </TooltipContent>
                </Tooltip>
              )}
              {cart?.checkout?.isEligible && (
                <div className="space-y-4">
                  {!hasSubscriptions(cart) && (
                    <div className="flex justify-center items-center space-x-2">
                      <Checkbox
                        id="saveCard"
                        checked={saveCardForFuture}
                        onCheckedChange={(checked) =>
                          setSaveCardForFuture(checked)
                        }
                      />
                      <label
                        htmlFor="saveCard"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t("saveCardForFuture")}
                      </label>
                    </div>
                  )}
                  <DButton
                    isMain
                    isDisabled={cart?.products?.length === 0}
                    onClickBtn={handleCheckout}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("checkout")}
                  </DButton>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("checkoutDescription")}
                  </p>
                </div>
              )}
            </TooltipProvider>
          )}
        </div>
      </div>

      <CartCheckoutSummary
        cart={cart}
        isLoading={isLoading}
        session={session}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        isOpen={isCheckoutSummaryOpen}
        onClose={() => setIsCheckoutSummaryOpen(false)}
      />
    </Card>
  )
}
