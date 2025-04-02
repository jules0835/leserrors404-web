"use client"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/features/shop/product/productCard"
import { webAppSettings } from "@/assets/options/config"
import { useTranslations } from "next-intl"
import GridProductsSkeleton from "@/components/skeleton/GridProductsSkeleton"
import { fetchProducts } from "@/features/shop/product/utils/product"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ShopProductList() {
  const [page, setPage] = useState(1)
  const searchParams = useSearchParams()
  const t = useTranslations("ProductPage")
  const searchQuery = searchParams.get("q")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const categories = searchParams.get("categories")
  const sort = searchParams.get("sort")
  const availability = searchParams.get("availability")
  const keywords = searchParams.get("keywords")
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")

  useEffect(() => {
    setPage(1)
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    categories,
    sort,
    availability,
    keywords,
    dateFrom,
    dateTo,
  ])

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "products",
      page,
      searchQuery,
      minPrice,
      maxPrice,
      categories,
      sort,
      availability,
      keywords,
      dateFrom,
      dateTo,
    ],
    queryFn: () =>
      fetchProducts({
        page,
        searchQuery,
        minPrice,
        maxPrice,
        categories,
        sort,
        availability,
        keywords,
        dateFrom,
        dateTo,
      }),
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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && products && products.length === 0 && (
          <div className="flex flex-col items-center">
            <h1 className="text-center font-semibold text-xl mt-6">
              {t("noResults")}
            </h1>
            <Image
              src={webAppSettings.images.notFoundUrl}
              alt="not found"
              width={600}
              height={600}
            />
          </div>
        )}
      </div>
      <Pagination className={"mt-7"}>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              />
            </PaginationItem>
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
