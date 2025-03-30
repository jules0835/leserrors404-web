import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import { format } from "date-fns"
import ListSkeleton from "@/components/skeleton/ListSkeleton"

export default function SelectOrder({ onSelect }) {
  const [page, setPage] = useState(1)
  const limit = 5
  const t = useTranslations("Contact.Chatbot.Actions")
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-orders", page],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/dashboard/business/orders?page=${page}&limit=${limit}&sortField=createdAt&sortOrder=desc`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      return response.json()
    },
  })

  if (error) {
    return <div className="p-4 text-red-500">{t("SELECT_ORDER.error")}</div>
  }

  if (!data?.orders?.length && !isLoading) {
    return <div className="p-4">{t("SELECT_ORDER.noOrders")}</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <ListSkeleton rows={5} height={12} />
          </div>
        )}
        {!isLoading &&
          data.orders.map((order) => (
            <Button
              key={order._id}
              variant="outline"
              className="w-full justify-start gap-2 h-14 p-2"
              onClick={() => onSelect(order)}
            >
              <Package className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {t("SELECT_ORDER.orderNumber", {
                    number: order._id.slice(-6),
                  })}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "PPP")} -{" "}
                  {order.stripe.amountTotal.toFixed(2)}{" "}
                  {order.stripe.currency.toUpperCase()}
                </span>
              </div>
            </Button>
          ))}
      </div>

      {!isLoading && data.total > limit && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t("SELECT_ORDER.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= data.total}
          >
            {t("SELECT_ORDER.next")}
          </Button>
        </div>
      )}
    </div>
  )
}
