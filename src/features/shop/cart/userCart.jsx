"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCart } from "./utils/cartService"
import { useCart } from "@/features/shop/cart/context/cartContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Trash2, Plus, Minus, ShoppingBag, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { useSession } from "next-auth/react"
import ErrorFront from "@/components/navigation/error"
import toast from "react-hot-toast"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserCart() {
  const t = useTranslations("Shop.Cart")
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const {
    updateProdCart,
    removeProdFromCart,
    applyCartVoucher,
    removeCartVoucher,
  } = useCart()
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
  const [voucherCode, setVoucherCode] = useState("")
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)
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
  const displayLoadingCalcul = (value, size) =>
    isUpdating || isLoading ? (
      <Skeleton className={`w-${size} h-6`} />
    ) : (
      `${value} €`
    )

  return (
    <div className="container mx-auto pb-20">
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
            <div className="space-y-6">
              {!isLoading && !session && (
                <div className="space-y-4">
                  <div className="flex justify-center flex-col items-center space-y-4">
                    <UserPlus size={48} />
                  </div>
                  <h1 className="text-lg font-semibold text-center mb-2">
                    {t("loginToProceed")}
                  </h1>
                  <div className="flex space-x-2">
                    <div className="w-full">
                      <DButton
                        isMain
                        withLink="/auth/login"
                        styles={"flex-grow  w-full"}
                      >
                        {t("login")}
                      </DButton>
                    </div>
                    <div className="w-full">
                      <DButton
                        withLink="/auth/register"
                        styles={"flex-grow  w-full"}
                      >
                        {t("register")}
                      </DButton>
                    </div>
                  </div>
                  <Separator />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold mb-4">{t("orderSummary")}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("subtotal")}
                    </span>
                    <span>
                      {displayLoadingCalcul(cart?.subtotal.toFixed(2), "16")}
                    </span>
                  </div>

                  {cart?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t("discount")}</span>
                      <span>
                        -{displayLoadingCalcul(cart?.discount.toFixed(2), "20")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("taxes")}</span>
                    <span>
                      {displayLoadingCalcul(cart?.tax?.toFixed(2), "16")}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>{t("total")}</span>
                    <span>
                      {displayLoadingCalcul(cart?.total.toFixed(2), "24")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                {cart?.voucher && (
                  <div className="flex justify-between items-center border rounded-md p-2">
                    <span>{`${cart.voucher.code} - ${cart.voucher.type === "percentage" ? `${cart.voucher.amount}%` : `${cart.voucher.amount}€`}`}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveVoucher}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!isLoading && session && (
                  <DButton isMain isDisabled={cart?.products?.length === 0}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("checkout")}
                  </DButton>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
