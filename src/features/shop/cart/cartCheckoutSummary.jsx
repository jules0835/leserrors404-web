import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import { displayLoadingCalcul } from "@/features/shop/cart/utils/cart"
import CartCheckoutAddresses from "@/features/shop/cart/cartCheckoutAddresses"
import { useRouter } from "@/i18n/routing"
import { checkOutStripe } from "@/features/shop/cart/utils/cartService"
import { useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, ShoppingCart } from "lucide-react"
import DButton from "@/components/ui/DButton"

export default function CartCheckoutSummary({
  cart,
  isLoading,
  session,
  isUpdating,
  setIsUpdating,
  isOpen,
  onClose,
}) {
  const t = useTranslations("Shop.Cart")
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const handleConfirmCheckout = async () => {
    setIsCheckingOut(true)
    const response = await checkOutStripe(false)

    if (response.canCheckout) {
      router.push(response.url)
    } else {
      toast.error(response.message)
    }

    setIsCheckingOut(false)
  }
  const getPrice = (item) => {
    if (item.product.subscription && item.billingCycle) {
      return item.billingCycle === "year"
        ? item.product.priceAnnual
        : item.product.priceMonthly
    }

    return item.product.price
  }
  const getPriceDisplay = (item) => {
    if (item.product.subscription && item.billingCycle) {
      const cycle = item.billingCycle === "year" ? t("year") : t("month")

      return `${getPrice(item)}€/${cycle}`
    }

    return `${getPrice(item)}€`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center md:text-left">
            {t("checkoutSummary")}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-semibold text-center md:text-left">
                {t("yourProducts")}
              </h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {cart?.products?.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg"
                  >
                    <Image
                      src={item.product.picture}
                      alt={item.product.label.en}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2">
                        <div className="space-y-1 text-center md:text-left w-full">
                          <h4 className="font-semibold">
                            {item.product.label.en}
                          </h4>
                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <Badge
                              variant={
                                item.product.subscription
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.product.subscription ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : (
                                <ShoppingCart className="w-3 h-3 mr-1" />
                              )}
                              {item.product.subscription
                                ? t("subscription")
                                : t("oneTimePurchase")}
                            </Badge>
                            {item.product.subscription && item.billingCycle && (
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20"
                              >
                                {item.billingCycle === "year"
                                  ? t("annual")
                                  : t("monthly")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-center md:text-right w-full md:w-auto">
                          <p className="font-bold">
                            {(getPrice(item) * item.quantity).toFixed(2)}€
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getPriceDisplay(item)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-center md:text-left">
                  {t("orderSummary")}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("subtotal")}
                    </span>
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
                  <Separator />
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

              <div>
                <CartCheckoutAddresses
                  cart={cart}
                  session={session}
                  setIsUpdating={setIsUpdating}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t mt-4">
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <DButton onClickBtn={onClose} className="w-full md:w-auto">
              {t("cancel")}
            </DButton>
            <DButton
              isMain
              onClickBtn={handleConfirmCheckout}
              isLoading={isCheckingOut}
              className="w-full md:w-auto"
            >
              {t("confirmCheckout")}
            </DButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
