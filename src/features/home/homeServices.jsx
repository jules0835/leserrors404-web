"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { useQuery } from "@tanstack/react-query"
import CategorySkeleton from "@/features/suggestions/categorySkeleton"
import { fetchCategories } from "@/features/suggestions/services/suggested"
import { Link } from "@/i18n/routing"

export default function HomeServices() {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true })
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
    <div ref={ref} className="w-full pb-10 px-10">
      <motion.h1
        className="text-3xl font-bold text-center text-white mt-16"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {t("ourServices")}
      </motion.h1>
      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              className="bg-white p-4 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
            >
              {category.picture && (
                <Image
                  src={category.picture}
                  alt={category.label?.en || "Category image"}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <h2 className="text-xl font-bold mt-4">
                {category.label?.en || "Category"}
              </h2>
              <p className="mt-2 mb-4">
                {category.description?.en || "No description available"}
              </p>
              <Link
                href={`/shop/products?categories=${category._id}`}
                className="mt-8 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700"
              >
                {t("learnMoreCategory")}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
