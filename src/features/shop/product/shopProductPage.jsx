"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchProduct } from "@/features/shop/product/utils/product"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import ErrorFront from "@/components/navigation/error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Minus,
  Plus,
  ShoppingCart,
  AlertCircle,
  Check,
  ArrowLeft,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/features/shop/cart/context/cartContext"
import DButton from "@/components/ui/DButton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ProductPageSkeleton from "@/features/shop/product/productPageSkeleton"
import { useRouter } from "@/i18n/routing"
import { getLocalizedValue } from "@/lib/utils"
import SuggestedProducts from "@/features/suggestions/suggestedProducts"
import { useTitle } from "@/components/navigation/titleContext"

export default function ShopProductPage() {
  const { addProdToCart } = useCart()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [billingCycle, setBillingCycle] = useState("month")
  const t = useTranslations("Shop.Product")
  const { Id } = useParams()
  const router = useRouter()
  const locale = useLocale()
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", Id],
    queryFn: () => fetchProduct(Id),
    enabled: Boolean(Id),
  })
  const { setTitle } = useTitle()
  setTitle(getLocalizedValue(product?.label, locale) || t("title"))

  useEffect(() => {
    setQuantity(1)
  }, [Id])

  const handleQuantityChange = (increment) => {
    if (increment) {
      setQuantity((prev) => Math.min(prev + 1, product?.stock || 1))
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
    }
  }
  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    const success = await addProdToCart(
      Id,
      quantity,
      product?.subscription ? billingCycle : undefined
    )

    if (success) {
      queryClient.invalidateQueries(["cart"])
    }

    setIsAddingToCart(false)
  }
  const getCurrentPrice = () => {
    if (!product) {
      return 0
    }

    if (product.subscription) {
      return billingCycle === "year"
        ? product.priceAnnual
        : product.priceMonthly
    }

    return product.price
  }
  const getPriceDisplay = () => {
    if (!product) {
      return "0€"
    }

    if (product.subscription) {
      const monthlyPrice = product.priceMonthly
      const annualPrice = product.priceAnnual

      if (billingCycle === "year") {
        const savings = (monthlyPrice * 12 - annualPrice).toFixed(2)

        return (
          <span className="flex items-center">
            {annualPrice}€ / {t("year")}
            <Badge className="text-xs ml-2">
              {t("save")} {savings}€
            </Badge>
          </span>
        )
      }

      return `${monthlyPrice}€ / ${t("month")}`
    }

    return `${product.price}€`
  }
  const getStockStatus = () => {
    if (!product) {
      return null
    }

    if (product.stock === 0) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("outOfStock")}</AlertTitle>
          <AlertDescription>{t("outOfStockDescription")}</AlertDescription>
        </Alert>
      )
    }

    if (product.stock < 5) {
      return (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("lowStock")}</AlertTitle>
          <AlertDescription>
            {t("lowStockDescription", { count: product.stock })}
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        <span className="text-sm text-muted-foreground">{t("goBack")}</span>
      </div>
      {isLoading && <ProductPageSkeleton />}
      {error && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <ErrorFront />
        </div>
      )}
      {product && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
                <Image
                  src={product.picture}
                  alt={getLocalizedValue(product.label, locale)}
                  className="object-cover transition-transform hover:scale-105 duration-500"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>

              {product.subscription && (
                <div className="mt-4 flex justify-center">
                  <Badge
                    variant="outline"
                    className="px-4 py-1.5 text-sm font-medium bg-primary/5 text-primary border-primary/20"
                  >
                    {t("subscription")}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {getLocalizedValue(product.label, locale)}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {getLocalizedValue(product.description, locale)}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{getPriceDisplay()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span>
                  {product.stock > 0
                    ? t("inStock", { count: product.stock })
                    : t("outOfStock")}
                </span>
              </div>

              {product.characteristics &&
                Object.keys(product.characteristics).length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold">
                      {t("characteristics")}
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(product.characteristics).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="text-muted-foreground">
                                {getLocalizedValue(value, locale)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="p-6 border rounded-xl shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-6">
                {t("addToCartTitle")}
              </h2>
              {getStockStatus()}

              {product.subscription && (
                <div className="mb-6">
                  <Tabs
                    defaultValue="month"
                    value={billingCycle}
                    onValueChange={setBillingCycle}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger
                        value="month"
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        {t("monthly")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="year"
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        {t("annual")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="month" className="mt-2">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="font-medium text-lg">
                          {product.priceMonthly}€/{t("month")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("monthlyDescription")}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="year" className="mt-2">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="font-medium text-lg">
                          {product.priceAnnual}€/{t("year")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("save")}{" "}
                          {(
                            product.priceMonthly * 12 -
                            product.priceAnnual
                          ).toFixed(2)}
                          € {t("comparedToMonthly")}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <p className="font-medium">{t("quantity")}:</p>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            product.stock,
                            parseInt(e.target.value, 10) || 1
                          )
                        )
                      )
                    }
                    className="w-16 text-center border-0 h-10 rounded-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-lg font-semibold flex justify-between">
                  <span>{t("total")}:</span>
                  <span>{getCurrentPrice() * quantity}€</span>
                </p>
              </div>

              <DButton
                onClickBtn={handleAddToCart}
                isMain
                isDisabled={isAddingToCart || product.stock === 0}
                className="w-full h-12 text-base"
                isLoading={isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? t("outOfStock") : t("addToCart.button")}
              </DButton>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        <SuggestedProducts isProductPage />
      </div>
    </div>
  )
}
