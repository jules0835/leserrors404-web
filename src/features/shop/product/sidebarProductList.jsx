"use client"
import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuery } from "@tanstack/react-query"
import { fetchCategories } from "@/features/shop/product/utils/product"
import { useSearchParams } from "next/navigation"
import DButton from "@/components/ui/DButton"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"

export default function SidebarProductList() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations("ProductPage")
  const [isExpanded, setIsExpanded] = useState(false)
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 50000,
  ])
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categories") || ""
  )
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")
  const [availability, setAvailability] = useState(
    searchParams.get("availability") || "all"
  )
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0])
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 50000) {
      params.set("maxPrice", priceRange[1])
    } else {
      params.delete("maxPrice")
    }

    if (selectedCategory) {
      params.set("categories", selectedCategory)
    } else {
      params.delete("categories")
    }

    if (sortBy !== "newest") {
      params.set("sort", sortBy)
    } else {
      params.delete("sort")
    }

    if (availability !== "all") {
      params.set("availability", availability)
    } else {
      params.delete("availability")
    }

    router.push(`?${params.toString()}`)
    setIsExpanded(false)
  }
  const resetFilters = () => {
    setPriceRange([0, 5000])
    setSelectedCategory("")
    setSortBy("newest")
    setAvailability("all")
    router.push("/shop/products")
    setIsExpanded(false)
  }

  return (
    <Card className="p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t("filters")}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              {t("reset")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>

        <div
          className={`space-y-6 ${isExpanded ? "block" : "hidden md:block"}`}
        >
          <Accordion type="multiple">
            <AccordionItem value="category">
              <AccordionTrigger>{t("categories")}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categoriesData?.categories?.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category._id}
                        checked={selectedCategory === category._id}
                        onCheckedChange={(checked) => {
                          setSelectedCategory(checked ? category._id : "")
                        }}
                      />
                      <Label htmlFor={category._id}>
                        {category.label[locale] ||
                          category.label.en ||
                          "Untitled Category"}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger>{t("priceRange")}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  <Slider
                    defaultValue={[0, 50000]}
                    max={50000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-2">
            <Label>{t("sortBy")}</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("newest")}</SelectItem>
                <SelectItem value="price-asc">{t("priceAsc")}</SelectItem>
                <SelectItem value="price-desc">{t("priceDesc")}</SelectItem>
                <SelectItem value="popular">{t("mostPopular")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("availability")}</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="in-stock">{t("inStock")}</SelectItem>
                <SelectItem value="out-of-stock">{t("outOfStock")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DButton isMain onClickBtn={updateFilters} className="w-full">
            {t("applyFilters")}
          </DButton>
        </div>
      </div>
    </Card>
  )
}
