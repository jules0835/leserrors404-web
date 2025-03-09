"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchProduct } from "@/features/shop/product/utils/product"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import ErrorFront from "@/components/navigation/error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/features/shop/cart/context/cartContext"
import DButton from "@/components/ui/DButton"

export default function ShopProductPage() {
  const { addProdToCart } = useCart()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const t = useTranslations("Shop.Product")
  const { id } = useParams()
  const locale = useLocale()
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  })
  const getLocalizedValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return value[locale] || value.en || ""
    }

    return value
  }
  const handleQuantityChange = (increment) => {
    if (increment) {
      setQuantity((prev) => prev + 1)
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
    }
  }
  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    const success = await addProdToCart(id, quantity)

    if (success) {
      queryClient.invalidateQueries(["cart"])
    }

    setIsAddingToCart(false)
  }

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Skeleton className="h-10 w-72 mb-4" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-80 w-80" />
        </div>
      )}
      {error && (
        <div>
          <ErrorFront />
        </div>
      )}
      {product && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Image
              src={product.picture}
              alt={getLocalizedValue(product.label)}
              className="w-full h-auto rounded-lg shadow-md"
              width={400}
              height={400}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">
              {getLocalizedValue(product.label)}
            </h1>
            <p className="text-lg mb-4">
              {getLocalizedValue(product.description)}
            </p>
            <p className="text-lg mb-4">
              <strong>Price:</strong> ${product.price}
            </p>
            <p className="text-lg mb-4">
              <strong>Stock:</strong> {product.stock}
            </p>
          </div>
          <div className="flex-1">
            <div className="p-4 border rounded-lg shadow-md">
              <p className="text-lg mb-4">
                <strong>{t("price")}:</strong> {product.price}€
              </p>

              <div className="flex items-center gap-4 mb-4">
                <p className="font-medium">{t("quantity")}:</p>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, parseInt(e.target.value, 10) || 1)
                      )
                    }
                    className="w-16 text-center border-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DButton
                onClickBtn={handleAddToCart}
                isMain
                isDisabled={isAddingToCart || product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? t("outOfStock") : t("addToCart.button")}
              </DButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
