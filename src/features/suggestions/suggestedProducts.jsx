"use client"
import { useLocale, useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/features/suggestions/services/suggested"
import ProductSkeleton from "@/features/suggestions/productSkeleton"
import { trimString, getLocalizedValue } from "@/lib/utils"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { motion } from "motion/react"

export default function SuggestedProducts({ isProductPage = false }) {
  const t = useTranslations("HomePage")
  const locale = useLocale()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })
  const products = data?.products || []

  if (isError || !products.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={`${isProductPage ? "" : "space-y-4 md:space-y-6 py-6 md:py-8 px-4 md:px-32"}`}
    >
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2
          className={`text-xl md:text-2xl font-bold ${isProductPage ? "" : "text-white"}`}
        >
          {isProductPage ? t("otherProducts") : t("ourProducts")}
        </h2>
        <Button
          variant="ghost"
          asChild
          className={`${isProductPage ? "" : "text-white "}`}
        >
          <Link href="/shop/products" className="flex items-center">
            {t("viewAllProducts")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
            >
              <Card className="flex flex-col h-full rounded-md">
                <CardHeader className="pb-3 md:pb-4">
                  <div className="relative h-32 md:h-40 w-full mb-2">
                    <Image
                      src={product.picture || "/placeholder.svg"}
                      alt={getLocalizedValue(product.label, locale)}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <CardTitle className="text-base md:text-lg">
                    {getLocalizedValue(product.label, locale)}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.categories &&
                      product.categories.slice(0, 1).map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="text-xs md:text-sm"
                        >
                          {category}
                        </Badge>
                      ))}
                    <Badge variant="secondary" className="text-xs md:text-sm">
                      {product.subscription ? t("subscription") : t("oneTime")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {trimString(
                      getLocalizedValue(product.description, locale),
                      60
                    )}
                  </p>
                  {product.characteristics && (
                    <ul className="mt-2 md:mt-3 space-y-1">
                      {Array.isArray(
                        getLocalizedValue(product.characteristics, locale)
                      ) &&
                        getLocalizedValue(product.characteristics, locale)
                          .slice(0, 3)
                          .map((characteristic, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-xs md:text-sm"
                            >
                              <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 mr-1 text-green-500 shrink-0 mt-0.5" />
                              <span>{characteristic}</span>
                            </li>
                          ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between w-full items-center">
                    <span className="font-bold text-sm md:text-base">
                      {(() => {
                        if (product.price) {
                          return `${product.price.toFixed(2)}€`
                        }

                        if (product.subscription) {
                          return `${product.priceMonthly.toFixed(2)}€/${t("month")}`
                        }

                        return ""
                      })()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs md:text-sm"
                    >
                      <Link href={`/shop/products/${product._id}`}>
                        {t("learnMore")}
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
