import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CartProduct({
  item,
  handleQuantityChange,
  handleRemoveProduct,
  handleBillingCycleChange,
  isUpdating,
}) {
  const t = useTranslations("Shop.Cart")
  const router = useRouter()
  const getPrice = () => {
    if (item.product.subscription && item.billingCycle) {
      return item.billingCycle === "year"
        ? item.product.priceAnnual
        : item.product.priceMonthly
    }

    return item.product.price
  }
  const formatPrice = (price, withTax = true) => {
    const basePrice = price
    const finalPrice = withTax
      ? basePrice * (1 + (item.product.taxe || 0) / 100)
      : basePrice

    return finalPrice.toFixed(2)
  }
  const getPriceDisplay = () => {
    const basePrice = getPrice()
    const cycle =
      item.product.subscription && item.billingCycle
        ? `/${item.billingCycle === "year" ? t("year") : t("month")}`
        : ""

    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {formatPrice(basePrice, false)}€ HT{cycle}
        </p>
        <p className="font-semibold">
          {formatPrice(basePrice)}€ TTC{cycle}
        </p>
      </div>
    )
  }
  const getTotalDisplay = () => {
    const basePrice = getPrice()
    const { quantity } = item
    const total = basePrice * quantity

    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {formatPrice(total, false)}€ HT
        </p>
        <p className="font-semibold text-xl">{formatPrice(total)}€ TTC</p>
        <p className="text-xs text-muted-foreground">
          {formatPrice(basePrice)}€ TTC × {quantity}
        </p>
      </div>
    )
  }
  const isOutOfStock = item.product.stock === 0
  const isQuantityExceedingStock = item.quantity > item.product.stock

  return (
    <div key={item.product._id}>
      <div className="flex flex-col sm:flex-row gap-4 bg-card rounded-lg border shadow-sm p-6">
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
          <Image
            src={item.product.picture || "/placeholder.svg"}
            alt={item.product.label.en}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <div className="space-y-2">
              <h3
                className="font-semibold text-lg hover:underline cursor-pointer"
                onClick={() =>
                  router.push(`/shop/products/${item.product._id}`)
                }
              >
                {item.product.label.en}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={item.product.subscription ? "default" : "secondary"}
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
                    {item.billingCycle === "year" ? t("annual") : t("monthly")}
                  </Badge>
                )}
                {!item.product.isActive && (
                  <Badge variant="destructive">{t("productNotActive")}</Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive">{t("outOfStock")}</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              {item.quantity > 1 ? getTotalDisplay() : getPriceDisplay()}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleQuantityChange(item.product._id, false)}
                  disabled={
                    isUpdating || !item.product.isActive || isOutOfStock
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="h-8 w-12 rounded-none text-center border-y [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleQuantityChange(item.product._id, true)}
                  disabled={
                    isUpdating ||
                    !item.product.isActive ||
                    isOutOfStock ||
                    isQuantityExceedingStock
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {item.product.subscription && (
                <Select
                  value={item.billingCycle}
                  onValueChange={(value) =>
                    handleBillingCycleChange(item.product._id, value)
                  }
                  disabled={
                    isUpdating || !item.product.isActive || isOutOfStock
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={t("selectBillingCycle")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">{t("monthly")}</SelectItem>
                    <SelectItem value="year">{t("annual")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveProduct(item.product._id)}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4 mr-1" /> {t("remove")}
            </Button>
          </div>

          {(isOutOfStock || isQuantityExceedingStock) && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-4">
              <AlertCircle className="h-4 w-4" />
              <span>
                {isOutOfStock
                  ? t("productOutOfStock")
                  : t("productOutOfStockUserQuantity")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
