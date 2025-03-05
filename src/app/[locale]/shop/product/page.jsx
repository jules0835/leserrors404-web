"use client"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/features/shop/product/productCard"
import { webAppSettings } from "@/assets/options/config"
import { useTranslations } from "next-intl"
import GridProductsSkeleton from "@/components/skeleton/GridProductsSkeleton"

async function fetchProducts({ queryKey }) {
  const [, page, searchQuery] = queryKey
  const res = await fetch(
    `/api/shop/product?page=${page}&limit=${webAppSettings.shop.products.itemsPerPage}&q=${searchQuery || ""}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  return res.json()
}

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")
  const t = useTranslations("ProductPage")

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", page, searchQuery],
    queryFn: fetchProducts,
    keepPreviousData: true,
  })
  const products = data?.products || []
  const total = data?.total || 0
  const totalPages = Math.ceil(
    total / webAppSettings.shop.products.itemsPerPage
  )

  return (
    <div>
      {searchQuery && (
        <h1 className="text-2xl font-bold mb-4">
          {t("searchResultsFor")} "{searchQuery}"
        </h1>
      )}
      {!searchQuery && (
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      )}
      <div className="mt-4">
        {isLoading && <GridProductsSkeleton cells={5} rows={2} />}
        {error && (
          <div className="bg-orange-300 border border-orange-500 m-4 rounded-md">
            <p className="text-center m-2">{t("error")}</p>
          </div>
        )}
        {products && products.length !== 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
