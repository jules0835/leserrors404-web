"use client"
import { useQuery } from "@tanstack/react-query"
import {
  getCart,
  updateProductQuantity,
  removeProductFromCart,
} from "./utils/cartService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export default function UserCart() {
  const t = useTranslations("Shop.Cart")
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    data: cart,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  })
  const handleQuantityChange = async (productId, quantity) => {
    setIsUpdating(true)

    const adjustedQuantity = quantity < 1 ? 1 : quantity

    await updateProductQuantity(productId, adjustedQuantity)
    await refetch()
    setIsUpdating(false)
  }
  const handleRemoveProduct = async (productId) => {
    setIsUpdating(true)
    await removeProductFromCart(productId)
    await refetch()
    setIsUpdating(false)
  }
  const calculateTotal = () =>
    cart?.products?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading cart</div>
  }

  if (!cart?.products?.length) {
    return <div>{t("emptyCart")}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("yourCart")}</h1>
      <div className="space-y-4">
        {cart.products.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center gap-4 border p-4 rounded-lg"
          >
            <Image
              src={item.product.picture}
              alt={item.product.label.en}
              width={100}
              height={100}
              className="rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.label.en}</h3>
              <p className="text-sm text-gray-500">{item.product.price}€</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(
                    item.product._id,
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-20"
                disabled={isUpdating}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveProduct(item.product._id)}
                disabled={isUpdating}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-xl font-bold">
          {t("total")}: {calculateTotal()}€
        </div>
      </div>
    </div>
  )
}
