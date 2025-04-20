"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/features/suggestions/services/suggested"
import ProductSkeleton from "@/features/suggestions/productSkeleton"

export default function SuggestedProducts({ isProductPage = false }) {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true })
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  if (isError || !products.length) {
    return null
  }

  return (
    <div ref={ref} className="w-full pb-10 px-10">
      <motion.h1
        className={`text-3xl font-bold text-center mt-11 ${
          isProductPage ? "" : "text-white"
        }`}
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {t("ourProducts")}
      </motion.h1>
      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <motion.div
          className="w-full mx-auto px-8 mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="pl-4 basis-full md:basis-1/4"
                >
                  <Card className="border-none shadow-lg rounded-2xl">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                      {product.picture && (
                        <Image
                          src={product.picture}
                          alt={product.label?.en || "Product image"}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <h2 className="text-xl font-bold mt-4">
                        {product.label?.en || "Product"}
                      </h2>
                      <p className="mt-2">
                        {product.description?.en || "No description available"}
                      </p>
                      <Link
                        href={`/shop/products/${product._id}`}
                        className="mt-4 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700"
                      >
                        {t("learnMore")}
                      </Link>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between mt-4">
              <CarouselPrevious className="w-10 h-10 border-none shadow-md" />
              <CarouselNext className="w-10 h-10 border-none shadow-md" />
            </div>
          </Carousel>
        </motion.div>
      )}
    </div>
  )
}
