"use client"
import { useCart } from "@/features/shop/cart/context/cartContext"
import {
  ShoppingCartIcon,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
} from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from "next/image"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCart } from "@/features/shop/cart/utils/cartService"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { Button } from "@/components/ui/button"
import { webAppSettings } from "@/assets/options/config"
import { useRouter } from "@/i18n/routing"
import { trimString } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShoppingCart() {
  const { cartCount, removeProdFromCart, updateProdCart } = useCart()
  const t = useTranslations("Shop.Cart")
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const previousCartCount = useRef(cartCount)
  const queryClient = useQueryClient()
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isOpen,
    refetchOnMount: true,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (cartCount > previousCartCount.current && !isInitialLoad) {
      setIsOpen(true)
      setShowAddedMessage(true)
    }

    if (isInitialLoad) {
      setIsInitialLoad(false)
    }

    previousCartCount.current = cartCount
  }, [cartCount, isInitialLoad])

  useEffect(() => {
    if (!isOpen) {
      setShowAddedMessage(false)
    }
  }, [isOpen])

  const handleUpdateQuantity = async (
    productId,
    currentQuantity,
    increment
  ) => {
    try {
      setIsUpdating(true)
      const newQuantity = increment
        ? currentQuantity + 1
        : Math.max(1, currentQuantity - 1)

      await updateProdCart(productId, newQuantity)
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      await queryClient.refetchQueries({ queryKey: ["cart"] })
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      setIsUpdating(true)
      await removeProdFromCart(productId)
      await queryClient.invalidateQueries({ queryKey: ["cart"] })
      await queryClient.refetchQueries({ queryKey: ["cart"] })
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenChange = (open) => {
    setIsOpen(open)

    if (open) {
      queryClient.invalidateQueries(["cart"])
    }
  }
  const goToProductPage = (productId) => {
    router.push(`/shop/product/${productId}`)
    setIsOpen(false)
  }
  const handleAction = (e) => {
    e.stopPropagation()
  }

  const displayLoadingCalcul = (value) =>
    isUpdating ? <Skeleton className="w-16 h-6" /> : `${value} €`

  return (
    <HoverCard
      openDelay={0}
      closeDelay={100}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <HoverCardTrigger>
        <div className="flex items-center relative">
          <ShoppingCartIcon
            className="text-white hover:scale-125 scale-110"
            onClick={() => router.push("/shop/cart")}
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 mt-3 mr-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-2xl">{t("miniCart.title")}</h4>
            {cart?.products?.length > 0 && (
              <p className="text-base text-muted-foreground">
                {cartCount} {t("miniCart.subtitle")}
              </p>
            )}
          </div>
          {isLoading && (
            <div className="space-y-2">
              <ListSkeleton rows={3} height={8} />
            </div>
          )}
          {!isLoading && !cart?.products?.length && (
            <div>
              <div className="flex flex-col items-center justify-center space-y-4 p-4">
                <Image
                  src={webAppSettings.images.emptyCartUrl}
                  alt="Empty cart"
                  width={140}
                  height={140}
                />
                <hp className="text-xl font-medium text-center">
                  {t("emptyCart")}
                </hp>
                <hp className="text-sm text-muted-foreground text-center">
                  {t("emptyCartSubtitle")}
                </hp>
              </div>
              <div className="border-t">
                <DButton
                  isMain
                  withLink={`/shop/cart`}
                  onClickBtn={() => setIsOpen(false)}
                >
                  {t("viewCart")}
                </DButton>
              </div>
            </div>
          )}
          {!isLoading && cart?.products?.length > 0 && (
            <>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
                {cart.products.map((item) => (
                  <div
                    key={item.product._id}
                    onClick={() => goToProductPage(item.product._id)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <Image
                      src={item.product.picture}
                      alt={item.product.label.en}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {trimString(item.product.label.en, 20)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.product.price}€
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      onClick={handleAction}
                    >
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity,
                              false
                            )
                          }
                          disabled={isUpdating}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {isUpdating ? (
                            <Skeleton className="w-6 h-6 mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity,
                              true
                            )
                          }
                          disabled={isUpdating}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-4 text-lg">
                  <span className="font-medium">{t("total")}:</span>
                  <span>{displayLoadingCalcul(cart?.total.toFixed(2))}</span>
                </div>
                <DButton
                  isMain
                  withLink={`/shop/cart`}
                  onClickBtn={() => setIsOpen(false)}
                >
                  {t("viewCart")}
                </DButton>
              </div>
              {showAddedMessage && (
                <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{t("productAddedToCart")}</p>
                </div>
              )}
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
