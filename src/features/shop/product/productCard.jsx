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
import { SquarePlus } from "lucide-react"
import { trimString } from "@/lib/utils"
import { useRouter } from "@/i18n/routing"
import { useCart } from "@/features/shop/cart/context/cartContext"
import { useState } from "react"
import { AnimatedReload } from "@/components/actions/AnimatedReload"

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
    if (productPrice.subscription) {
      return `${getPrice(productPrice)}€/${t("month")}`
    }

    return `${getPrice(productPrice)}€`
  }
  const handleAddToCart = async (id) => {
    setIsLoading(true)
    await addProdToCart(id)
    setIsLoading(false)
  }

  return (
    <Card className="text-left flex flex-col h-full ">
      <CardHeader>
        <CardTitle className="flex items-center h-7">
          <p>
            {trimString(
              product.label[locale] ||
                product.label[webAppSettings.translation.defaultLocale],
              40
            )}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex w-full h-24 justify-center">
          <Image
            src={product.picture || webAppSettings.images.pictureDefaultUrl}
            alt="carousel"
            className="rounded-xl object-cover"
            width={200}
            height={200}
          />
        </div>
        <CardDescription className="mt-4">
          {trimString(
            product.description[locale] ||
              product.description[webAppSettings.translation.defaultLocale],
            60
          )}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col justify-between mt-auto">
        <div>
          <p>{getPriceDisplay(product)}</p>
        </div>
        <div className="flex w-full">
          <div className="flex-grow">
            <DButton
              isMain
              onClickBtn={() => router.push(`/shop/products/${product._id}`)}
            >
              {t("seeMore")}
            </DButton>
          </div>
          <div>
            <DButton
              styles={"ml-2"}
              onClickBtn={() => handleAddToCart(product._id)}
            >
              {isLoading ? <AnimatedReload /> : <SquarePlus size={20} />}
            </DButton>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
