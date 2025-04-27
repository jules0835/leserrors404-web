"use client"
import { useLocale, useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/features/suggestions/services/suggested"
import ProductSkeleton from "@/features/suggestions/productSkeleton"
import { trimString, getLocalizedValue } from "@/lib/utils"
import { Check } from "lucide-react"
import DButton from "@/components/ui/DButton"
import { motion } from "motion/react"

export default function ProductCompare() {
  const t = useTranslations("HomePage")
  const locale = useLocale()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })
  const products = data?.products || []
  const subscriptionProducts = data?.subscriptionProducts || []

  if (isError || (!products.length && !subscriptionProducts.length)) {
    return null
  }

  const productsToDisplay =
    subscriptionProducts.length > 0
      ? subscriptionProducts
      : [...products]
          .sort((a, b) => (b.priority || 0) - (a.priority || 0))
          .slice(0, 3)

  return (
    <div ref={ref} className="container mx-auto pt-8 md:pt-12 px-4 md:px-12">
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {t("compareSolutions")}
      </motion.h1>

      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center items-stretch">
          {productsToDisplay.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className={`flex flex-col border rounded-xl overflow-hidden border-primary bg-white transition-all duration-300 ${
                index === 1
                  ? " shadow-xl border-primary"
                  : "shadow-md mt-4 md:mt-8"
              }`}
              style={{
                width: "100%",
              }}
            >
              <div
                className={`p-4 md:p-6 h-[150px] md:h-[200px] ${
                  index === 1
                    ? "bg-[#2F1F80] text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <h2 className="text-lg md:text-xl font-bold">
                  {getLocalizedValue(product.label, locale)}
                </h2>
                <p className="mt-2 opacity-90 text-sm md:text-base">
                  {trimString(
                    getLocalizedValue(product.description, locale),
                    80
                  )}
                </p>
              </div>

              <div className="p-4 md:p-6 flex-grow flex flex-col">
                <div className="mb-4 md:mb-6">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {t("startingFrom")}
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl md:text-3xl font-bold">
                      {product.priceMonthly}€
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      /{t("month")}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {t("or")} {product.priceAnnual}€ {t("perYear")}
                  </p>
                </div>

                <div className="flex-grow">
                  <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">
                    {t("characteristics")}:
                  </h3>
                  <ul className="space-y-2 md:space-y-3">
                    {Array.isArray(
                      getLocalizedValue(product.characteristics, locale)
                    ) &&
                      getLocalizedValue(product.characteristics, locale)
                        .slice(0, 5)
                        .map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mr-2" />
                            <span className="text-xs md:text-sm">
                              {trimString(feature, 60)}
                            </span>
                          </li>
                        ))}
                  </ul>
                </div>

                <DButton
                  isMain={index === 1}
                  withLink={`/shop/products/${product._id}`}
                  className="text-xs md:text-sm mt-4"
                >
                  {t("chooseThisOffer")}
                </DButton>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
