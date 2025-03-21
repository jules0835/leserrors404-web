import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function CartProduct({
  item,
  handleQuantityChange,
  handleRemoveProduct,
  isUpdating,
}) {
  const t = useTranslations("Shop.Cart")

  return (
    <div>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          <div
            className={`flex-1 flex items-center gap-4 ${
              !item.product.isActive ? "opacity-50" : ""
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
                  <h3 className="font-semibold text-lg">
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
                    {!item.product.isActive && (
                      <Badge variant="destructive">
                        {t("productNotActive")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {item.quantity > 1 ? (
                      <span>
                        <span className="text-foreground text-xl">
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </span>
                        <span className="text-muted-foreground text-sm block">
                          {item.product.price}€ × {item.quantity}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xl">{item.product.price}€</span>
                    )}
                  </p>
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
                    disabled={isUpdating || !item.product.isActive}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, true)}
                    disabled={isUpdating || !item.product.isActive}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
