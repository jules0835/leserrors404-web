"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCart } from "./utils/cartService"
import { useCart } from "@/features/shop/cart/context/cartContext"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { useSession } from "next-auth/react"
import ErrorFront from "@/components/navigation/error"
import toast from "react-hot-toast"
import CartProduct from "@/features/shop/cart/cartProduct"
import CardCheckoutCart from "@/features/shop/cart/cardCheckoutCart"

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

  return (
    <div className="container mx-auto pb-20 pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6">{t("yourCart")}</h1>
          <div className="space-y-4">
            {error && <ErrorFront />}
            {isLoading && <ListSkeleton rows={3} height={12} />}
            {!isLoading &&
              !error &&
              (cart?.products?.length === 0 || !cart) && (
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
                    <DButton isMain withLink="/shop/product">
                      {t("continueShopping")}
                    </DButton>
                  </div>
                </div>
              )}
            {!isLoading &&
              !error &&
              cart?.products?.length > 0 &&
              cart.products.map((item) => (
                <CartProduct
                  key={item.product._id}
                  item={item}
                  handleQuantityChange={handleQuantityChange}
                  handleRemoveProduct={handleRemoveProduct}
                  isUpdating={isUpdating}
                />
              ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <CardCheckoutCart
            cart={cart}
            isLoading={isLoading}
            session={session}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        </div>
      </div>
    </div>
  )
}
