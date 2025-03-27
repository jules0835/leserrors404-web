import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useQuery } from "@tanstack/react-query"
import { useDebounce, useClickAway } from "@uidotdev/usehooks"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { useLocale, useTranslations } from "next-intl"
import { trimString } from "@/lib/utils"
import axios from "axios"
import { webAppSettings } from "@/assets/options/config"

export default function NavSearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const router = useRouter()
  const locale = useLocale()
  const ref = useClickAway(() => {
    setIsOpen(false)
  })
  const t = useTranslations("NavSearchBar")
  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", debouncedSearchTerm],
    queryFn: async () => {
      const response = await axios.get(
        `/api/shop/search?q=${debouncedSearchTerm}`
      )

      return response.data
    },
    enabled: Boolean(debouncedSearchTerm),
  })
  const handleSearch = (e) => {
    e.preventDefault()
    setIsOpen(false)
    router.push(`/shop/products?q=${searchTerm}`)
  }
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }
  const handleItemClick = (id, type) => {
    setIsOpen(false)

    if (type === "product") {
      router.push(`/shop/products/${id}`)
    }

    if (type === "category") {
      router.push(`/shop/category/${id}`)
    }
  }

  return (
    <div
      ref={ref}
      className="relative w-full md:w-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-4 md:mb-0 transition-all z-30"
    >
      <form
        onSubmit={handleSearch}
        className={`bg-white px-4 py-2 flex md:flex-row md:w-[500px]  ${
          isOpen && debouncedSearchTerm ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <input
          type="text"
          className="focus:outline-none w-full"
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <button type="submit">
          <Search className="text-[#2F1F80] hover:scale-125 transition-all hover:cursor-pointer" />
        </button>
      </form>
      {isOpen && debouncedSearchTerm && (
        <div className="absolute bg-white shadow-lg rounded-b-xl w-full md:w-[500px] border-t-2 border-[#7059e7] z-30">
          {!isLoading && error && (
            <div className="p-4 text-red-500">{t("error")}</div>
          )}
          <div className="p-2 text-gray-700 font-bold">{t("products")}</div>
          {isLoading && <ListSkeleton rows={1} />}
          {!isLoading && !error && data?.products.length === 0 && (
            <div className="px-4 py-2 text-gray-500">
              {t("noResults", { searchTerm: debouncedSearchTerm })}
            </div>
          )}
          <ul>
            {data?.products.map((product, indPrd) => (
              <li
                key={product._id}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  indPrd === data.products.length - 1 ? "" : "border-b"
                }`}
                onClick={() => handleItemClick(product._id, "product")}
              >
                {indPrd + 1} -{" "}
                {trimString(
                  product.label[locale] ??
                    product.label[webAppSettings.translation.defaultLocale],
                  50
                )}
              </li>
            ))}
          </ul>
          <div className="p-2 text-gray-700 font-bold">{t("categories")}</div>
          {isLoading && <ListSkeleton rows={1} />}
          {!isLoading && !error && data?.categories.length === 0 && (
            <div className="px-4 py-2 text-gray-500">
              {t("noCategoriesFound")}
            </div>
          )}
          <ul>
            {data?.categories.map((category, indCat) => (
              <li
                key={category._id}
                className={`px-4 py-2 border-b hover:bg-gray-100 cursor-pointer ${
                  indCat === data.categories.length - 1 ? "rounded-b-xl" : ""
                }`}
                onClick={() => handleItemClick(category._id, "category")}
              >
                {indCat + 1} -{" "}
                {trimString(
                  category.label[locale] ??
                    category.label[webAppSettings.translation.defaultLocale],
                  50
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
