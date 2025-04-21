import { Card } from "@/components/ui/card"
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
  const getPriceDisplay = () => {
    const priceWithoutTax = getPrice()
    const priceWithTax = priceWithoutTax * (1 + (item.product.taxe || 0) / 100)

    if (item.product.subscription && item.billingCycle) {
      const cycle = item.billingCycle === "year" ? t("year") : t("month")

      return (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {priceWithoutTax.toFixed(2)}€ HT/{cycle}
          </p>
          <p className="font-semibold">
            {priceWithTax.toFixed(2)}€ TTC/{cycle}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {priceWithoutTax.toFixed(2)}€ HT
        </p>
        <p className="font-semibold">{priceWithTax.toFixed(2)}€ TTC</p>
      </div>
    )
  }
  const getTotalPriceDisplay = () => {
    const priceWithoutTax = getPrice() * item.quantity
    const priceWithTax = priceWithoutTax * (1 + (item.product.taxe || 0) / 100)

    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {priceWithoutTax.toFixed(2)}€ HT
        </p>
        <p className="font-semibold text-xl">{priceWithTax.toFixed(2)}€ TTC</p>
      </div>
    )
  }
  const isOutOfStock = item.product.stock === 0
  const isQuantityExceedingStock = item.quantity > item.product.stock

  return (
    <div>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          <div
            className={`flex-1 flex items-center gap-4 ${
              !item.product.isActive || isOutOfStock ? "opacity-50" : ""
            }`}
          >
            <Image
              src={item.product.picture}
              alt={item.product.label.en}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3
                    className="font-semibold text-lg hover:underline cursor-pointer"
                    onClick={() =>
                      router.push(`/shop/products/${item.product._id}`)
                    }
                  >
                    {item.product.label.en}
                  </h3>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        item.product.subscription ? "default" : "secondary"
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
                    {!item.product.isActive && (
                      <Badge variant="destructive">
                        {t("productNotActive")}
                      </Badge>
                    )}
                    {isOutOfStock && (
                      <Badge variant="destructive">{t("outOfStock")}</Badge>
                    )}
                  </div>
                  {(isOutOfStock || isQuantityExceedingStock) && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {isOutOfStock
                          ? t("productOutOfStock")
                          : t("productOutOfStockUserQuantity")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {item.quantity > 1 ? (
                    <div className="space-y-1">
                      {getTotalPriceDisplay()}
                      <p className="text-sm text-muted-foreground">
                        {getPriceDisplay()} × {item.quantity}
                      </p>
                    </div>
                  ) : (
                    getPriceDisplay()
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.product._id, false)
                    }
                    disabled={
                      isUpdating || !item.product.isActive || isOutOfStock
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, true)}
                    disabled={
                      isUpdating ||
                      !item.product.isActive ||
                      isOutOfStock ||
                      isQuantityExceedingStock
                    }
                  >
                    <Plus className="h-4 w-4" />
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
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveProduct(item.product._id)}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
