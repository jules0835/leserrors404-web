import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { useQuery } from "@tanstack/react-query"
import { ShoppingBag } from "lucide-react"

export default function SelectProduct({ onSelect }) {
  const [search, setSearch] = useState("")
  const t = useTranslations("Contact.Chatbot.Actions")
  const locale = useLocale()
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/subscriptions").then((res) => res.json()),
  })
  const filteredProducts = products?.filter((product) =>
    product.label[locale].toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder={t("SELECT_PRODUCT.searchPlaceholder")}
        onValueChange={setSearch}
      />
      <CommandEmpty>{t("SELECT_PRODUCT.noResults")}</CommandEmpty>
      <div className="overflow-y-auto max-h-72">
        <CommandGroup>
          {filteredProducts?.map((product) => (
            <CommandItem
              key={product._id}
              onSelect={() => onSelect(product)}
              className="cursor-pointer"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">{product.label[locale]}</div>
                <div className="text-sm text-muted-foreground">
                  {product.subscription
                    ? `${product.priceMonthly}€/${t("monthly")} - ${
                        product.priceAnnual
                      }€/${t("annual")}`
                    : `${product.price}€`}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </div>
    </Command>
  )
}
