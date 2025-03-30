import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Package } from "lucide-react"

export default function SelectOrder({ onSelect }) {
  const [search, setSearch] = useState("")
  const t = useTranslations("Contact.Chatbot.Actions")
  const { data: orders } = useQuery({
    queryKey: ["user-orders"],
    queryFn: () => fetch("/api/subscriptions").then((res) => res.json()),
  })
  const filteredOrders = orders?.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder={t("SELECT_ORDER.searchPlaceholder")}
        onValueChange={setSearch}
      />
      <CommandEmpty>{t("SELECT_ORDER.noResults")}</CommandEmpty>
      <div className="overflow-y-auto max-h-72">
        <CommandGroup>
          {filteredOrders?.map((order) => (
            <CommandItem
              key={order._id}
              onSelect={() => onSelect(order)}
              className="cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">
                  {t("SELECT_ORDER.orderNumber", {
                    number: order._id.slice(-6),
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "PPP")}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </div>
    </Command>
  )
}
