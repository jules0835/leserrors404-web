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
  ShieldCheck,
  HelpCircle,
  Server,
  Zap,
  Shield,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

    const getPriceWithoutTax = () => {
      if (product.subscription) {
        return billingCycle === "year"
          ? product.priceAnnual
          : product.priceMonthly
      }

      return product.price
    }
    const priceWithoutTax = getPriceWithoutTax()
    const priceWithTax = priceWithoutTax * (1 + (product.taxe || 0) / 100)

    if (product.subscription) {
      const monthlyPriceWithoutTax = product.priceMonthly
      const monthlyPriceWithTax =
        monthlyPriceWithoutTax * (1 + (product.taxe || 0) / 100)
      const annualPriceWithoutTax = product.priceAnnual
      const annualPriceWithTax =
        annualPriceWithoutTax * (1 + (product.taxe || 0) / 100)

      if (billingCycle === "year") {
        const savings = (monthlyPriceWithTax * 12 - annualPriceWithTax).toFixed(
          2
        )

        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              <p>
                {annualPriceWithoutTax.toFixed(2)}€ HT/{t("year")}
              </p>
              <p>
                {annualPriceWithTax.toFixed(2)}€ TTC/{t("year")}
              </p>
            </div>
            <div className="flex items-center">
              <Badge className="text-xs ml-2">
                {t("save")} {savings}€
              </Badge>
            </div>
          </div>
        )
      }

      return (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {monthlyPriceWithoutTax.toFixed(2)}€ HT/{t("month")}
          </p>
          <p className="font-semibold">
            {monthlyPriceWithTax.toFixed(2)}€ TTC/{t("month")}
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
  const getBenefitCards = () => [
    {
      title: t("benefitCard1.title"),
      description: t("benefitCard1.description"),
      icon: Shield,
    },
    {
      title: t("benefitCard2.title"),
      description: t("benefitCard2.description"),
      icon: Zap,
    },
    {
      title: t("benefitCard3.title"),
      description: t("benefitCard3.description"),
      icon: Server,
    },
  ]
  const benefitCards = getBenefitCards()

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t("goBack")}</span>
      </button>

      {isLoading && <ProductPageSkeleton />}

      {error && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <ErrorFront />
        </div>
      )}

      {product && (
        <div className="space-y-12">
          {getStockStatus()}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
                <div className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm">
                  <ShieldCheck />
                </div>
                <Image
                  src={product.picture}
                  alt={"Product image"}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">
                    {getLocalizedValue(product.label, locale)}
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground mt-1">
                  {getLocalizedValue(product.description, locale)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.categories &&
                  product.categories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                <Badge variant="secondary">
                  {product.subscription ? t("subscription") : t("oneTime")}
                </Badge>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                {getPriceDisplay()}
              </div>
              <div className="mt-6">
                <Tabs
                  defaultValue={billingCycle}
                  onValueChange={setBillingCycle}
                  className="w-full"
                >
                  {product.subscription && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">
                          {t("chooseBillingCycle")}:
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                {t("billingCycleHelp")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <TabsList className="grid w-full grid-cols-2 mt-2">
                        <TabsTrigger value="month">{t("monthly")}</TabsTrigger>
                        <TabsTrigger value="year">{t("annual")}</TabsTrigger>
                      </TabsList>
                    </>
                  )}
                  <TabsContent value="month">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        {product.subscription && (
                          <>
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-lg font-semibold">
                                {t("monthly")}
                              </h3>
                              <div>
                                <span className="text-3xl font-bold">
                                  {product.priceMonthly?.toFixed(2)}€
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  /{t("month")}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
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
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold flex justify-between">
                              <span>{t("total")}:</span>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {(getCurrentPrice() * quantity).toFixed(2)}€
                                  HT
                                </p>
                                <p className="font-semibold">
                                  {(
                                    getCurrentPrice() *
                                    quantity *
                                    (1 + (product.taxe || 0) / 100)
                                  ).toFixed(2)}
                                  € TTC
                                </p>
                              </div>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="space-x-4">
                        <div className="flex-1">
                          <DButton
                            onClickBtn={handleAddToCart}
                            isDisabled={isAddingToCart || product.stock === 0}
                            isMain
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {product.stock === 0
                              ? t("outOfStock")
                              : t("addToCart.button")}
                          </DButton>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="year">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-lg font-semibold">
                            {t("annual")}
                          </h3>
                          <div>
                            <span className="text-3xl font-bold">
                              {product.priceAnnual?.toFixed(2)}€
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /{t("year")}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
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
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold flex justify-between">
                              <span>{t("total")}:</span>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {(getCurrentPrice() * quantity).toFixed(2)}€
                                  HT
                                </p>
                                <p className="font-semibold">
                                  {(
                                    getCurrentPrice() *
                                    quantity *
                                    (1 + (product.taxe || 0) / 100)
                                  ).toFixed(2)}
                                  € TTC
                                </p>
                              </div>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="space-x-4">
                        <div className="flex-1">
                          <DButton
                            onClickBtn={handleAddToCart}
                            isDisabled={isAddingToCart || product.stock === 0}
                            isMain
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {product.stock === 0
                              ? t("outOfStock")
                              : t("addToCart.button")}
                          </DButton>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-6">{t("keyFeatures")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.characteristics &&
                  product.characteristics[locale]?.map(
                    (characteristic, index) => (
                      <Card key={index} className="h-full">
                        <CardContent className="p-4 flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <p className="text-sm">{characteristic}</p>
                        </CardContent>
                      </Card>
                    )
                  )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">{t("whyChooseUs")}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {benefitCards.map((card, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <card.icon className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{card.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <SuggestedProducts isProductPage />
          </div>
        </div>
      )}
    </div>
  )
}
