"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCart } from "./utils/cartService"
import { useCart } from "@/features/shop/cart/context/cartContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Card } from "@/components/ui/card"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { useSession } from "next-auth/react"
import ErrorFront from "@/components/navigation/error"
import toast from "react-hot-toast"

export default function UserCart() {
  const t = useTranslations("Shop.Cart")
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const { updateProdCart, removeProdFromCart } = useCart()
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  })
  const handleQuantityChange = async (productId, increment) => {
    try {
      setIsUpdating(true)
      const currentItem = cart.products.find(
        (item) => item.product._id === productId
      )
      const newQuantity = increment
        ? currentItem.quantity + 1
        : Math.max(1, currentItem.quantity - 1)

      await updateProdCart(productId, newQuantity)
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      await queryClient.refetchQueries({ queryKey: ["cart"] })
    } catch (errorQt) {
      toast.error(`An error occurred, please try again.${errorQt}`)
    } finally {
      setIsUpdating(false)
    }
  }
  const handleRemoveProduct = async (productId) => {
    try {
      setIsUpdating(true)
      await removeProdFromCart(productId)
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      await queryClient.refetchQueries({ queryKey: ["cart"] })
    } catch (errorRm) {
      toast.error(`An error occurred, please try again.${errorRm}`)
    } finally {
      setIsUpdating(false)
    }
  }
  const calculateTotal = () =>
    cart?.products?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0

  return (
    <div className="container mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">{t("yourCart")}</h1>
          <div className="space-y-4">
            {error && <ErrorFront />}
            {isLoading && <ListSkeleton rows={3} height={12} />}
            {!isLoading && !error && cart?.products?.length === 0 && (
              <div className="container mx-auto p-4 mt-20">
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <Image
                    src={webAppSettings.images.emptyCartUrl}
                    alt="Empty cart"
                    width={200}
                    height={200}
                  />
                  <h2 className="text-2xl font-bold">{t("emptyCart")}</h2>
                  <p className="text-muted-foreground">
                    {t("emptyCartSubtitle")}
                  </p>
                  <DButton isMain withLink="/">
                    {t("continueShopping")}
                  </DButton>
                </div>
              </div>
            )}
            {!isLoading &&
              !error &&
              cart?.products?.length > 0 &&
              cart.products.map((item) => (
                <Card
                  key={item.product._id}
                  className="p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product.picture}
                      alt={item.product.label.en}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">
                        {item.product.label.en}
                      </h3>
                      <p className="text-lg font-bold">{item.product.price}€</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.product._id, false)
                            }
                            disabled={isUpdating}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.product._id, true)
                            }
                            disabled={isUpdating}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
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
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
              {isLoading && <ListSkeleton />}
              {!isLoading && cart && cart.products && (
                <p className="text-sm text-muted-foreground">
                  {cart.products.length} {t("items")}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {!isLoading && cart && cart.products && (
                <div className="flex justify-between">
                  <div className="flex justify-between text-lg">
                    <span>{t("subtotal")}</span>{" "}
                    <span>{calculateTotal()}€</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t("total")}</span> <span>{calculateTotal()}€</span>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && session && (
                <DButton isMain>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t("checkout")}
                </DButton>
              )}
              {!isLoading && !session && (
                <div className="space-y-2">
                  <DButton isMain withLink="/auth/login" className="w-full">
                    {t("login")}
                  </DButton>
                  <DButton withLink="/auth/register" className="w-full">
                    {t("register")}
                  </DButton>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
