"use client"
import { useQuery } from "@tanstack/react-query"
import { fetchProduct } from "@/features/shop/product/utils/product"
import { useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import ErrorFront from "@/components/navigation/error"

export default function ShopProductPage() {
  const { id } = useParams()
  const locale = useLocale()
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  })
  const getLocalizedValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return value[locale] || value.en || ""
    }

    return value
  }

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Skeleton className="h-10 w-72 mb-4" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-80 w-80" />
        </div>
      )}
      {error && (
        <div>
          <ErrorFront />
        </div>
      )}
      {product && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Image
              src={product.picture}
              alt={getLocalizedValue(product.label)}
              className="w-full h-auto rounded-lg shadow-md"
              width={400}
              height={400}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">
              {getLocalizedValue(product.label)}
            </h1>
            <p className="text-lg mb-4">
              {getLocalizedValue(product.description)}
            </p>
            <p className="text-lg mb-4">
              <strong>Price:</strong> ${product.price}
            </p>
            <p className="text-lg mb-4">
              <strong>Stock:</strong> {product.stock}
            </p>
          </div>
          <div className="flex-1">
            <div className="p-4 border rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Add to Cart</h2>
              <p className="text-lg mb-4">
                <strong>Price:</strong> ${product.price}
              </p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
