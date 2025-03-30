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
import { CreditCard } from "lucide-react"

export default function SelectSubscription({ onSelect }) {
  const [search, setSearch] = useState("")
  const t = useTranslations("Contact.Chatbot.Actions")
  const { data: subscriptions } = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: () => fetch("/api/subscriptions").then((res) => res.json()),
  })
  const filteredSubscriptions = subscriptions?.filter((subscription) =>
    subscription._id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder={t("SELECT_SUBSCRIPTION.searchPlaceholder")}
        onValueChange={setSearch}
      />
      <CommandEmpty>{t("SELECT_SUBSCRIPTION.noResults")}</CommandEmpty>
      <div className="overflow-y-auto max-h-72">
        <CommandGroup>
          {filteredSubscriptions?.map((subscription) => (
            <CommandItem
              key={subscription._id}
              onSelect={() => onSelect(subscription)}
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">
                  {t("SELECT_SUBSCRIPTION.subscriptionNumber", {
                    number: subscription._id.slice(-6),
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(subscription.createdAt), "PPP")} -{" "}
                  {t(`status.${subscription.stripe.status}`)}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </div>
    </Command>
  )
}
