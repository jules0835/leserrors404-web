"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { SquarePlus, ShieldCheck } from "lucide-react"
import { trimString } from "@/lib/utils"
import { useRouter } from "@/i18n/routing"
import { useCart } from "@/features/shop/cart/context/cartContext"
import { useState } from "react"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { Badge } from "@/components/ui/badge"

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  const { addProdToCart } = useCart()
  const locale = useLocale()
  const t = useTranslations("ProductCard")
  const router = useRouter()
  const getPrice = (productGetPrice) => {
    if (productGetPrice.subscription) {
      return productGetPrice.priceMonthly
    }

    return productGetPrice.price
  }
  const getPriceDisplay = (productPrice) => {
    const priceWithoutTax = getPrice(productPrice)
    const priceWithTax = priceWithoutTax * (1 + (productPrice.taxe || 0) / 100)

    if (productPrice.subscription) {
      return (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {priceWithoutTax.toFixed(2)}€ HT/{t("month")}
          </p>
          <p className="font-semibold">
            {priceWithTax.toFixed(2)}€ TTC/{t("month")}
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
  const handleAddToCart = async (id) => {
    setIsLoading(true)
    await addProdToCart(id)
    setIsLoading(false)
  }

  return (
    <Card
      className={`h-full flex flex-col ${product.stock <= 0 ? "opacity-50" : ""}`}
    >
      <CardHeader className="pb-4">
        <div className="relative h-48 w-full mb-4">
          <Image
            src={product.picture || webAppSettings.images.pictureDefaultUrl}
            alt={trimString(
              product.label[locale] ||
                product.label[webAppSettings.translation.defaultLocale],
              40
            )}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {trimString(
                product.label[locale] ||
                  product.label[webAppSettings.translation.defaultLocale],
                40
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {trimString(
                product.description[locale] ||
                  product.description[webAppSettings.translation.defaultLocale],
                200
              )}
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {product.categories &&
            product.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-1">
          {product.keyFeatures &&
            product.keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500 mt-1 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-4 border-t">
        <div className="flex justify-between w-full items-center mb-3">
          <div>{getPriceDisplay(product)}</div>
          <Badge variant="secondary">
            {product.subscription ? t("subscription") : t("oneTime")}
          </Badge>
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <DButton
              isMain
              onClickBtn={() => router.push(`/shop/products/${product._id}`)}
              className="flex-1"
            >
              {t("seeMore")}
            </DButton>
          </div>
          <div>
            <DButton
              onClickBtn={() => handleAddToCart(product._id)}
              isDisabled={product.stock <= 0}
              className="h-full"
            >
              {isLoading ? <AnimatedReload /> : <SquarePlus size={20} />}
              <span className="ml-2">{t("addToCart")}</span>
            </DButton>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
