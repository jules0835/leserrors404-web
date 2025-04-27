"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { useQuery } from "@tanstack/react-query"
import CategorySkeleton from "@/features/suggestions/categorySkeleton"
import { fetchCategories } from "@/features/suggestions/services/suggested"
import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomeServices() {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })

  if (isError || !categories.length) {
    return null
  }

  return (
    <div ref={ref} className="w-full pb-10 px-4 md:px-32">
      <motion.h1
        className="text-2xl md:text-3xl font-bold text-center text-white mt-8 md:mt-16"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {t("ourServices")}
      </motion.h1>
      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            >
              <Card className="overflow-hidden h-full rounded-md">
                <CardHeader className="p-0">
                  <div className="relative h-40 md:h-48 w-full">
                    <Image
                      src={
                        category.picture ||
                        `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(category.label?.en || "Category")}`
                      }
                      alt={category.label?.en || "Category image"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                    <div className="absolute bottom-0 left-0 p-3 md:p-4">
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {category.label?.en || "Category"}
                      </h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <p className="text-muted-foreground text-sm md:text-base">
                    {category.description?.en || "No description available"}
                  </p>
                </CardContent>
                <CardFooter className="p-3 md:p-4 pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/shop/products?categories=${category._id}`}
                      className="flex items-center justify-center"
                    >
                      {t("learnMoreCategory")}{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
