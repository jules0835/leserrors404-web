import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { format } from "date-fns"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import { formatIdForDisplay } from "@/lib/utils"

export default function SelectSubscription({ onSelect }) {
  const [page, setPage] = useState(1)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null)
  const limit = 5
  const t = useTranslations("Contact.Chatbot.Actions")
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-subscriptions", page],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/dashboard/business/subscriptions?page=${page}&limit=${limit}&sortField=createdAt&sortOrder=desc`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }

      return response.json()
    },
  })
  const handleSubscriptionSelect = async (subscription) => {
    setSelectedSubscriptionId(subscription._id)

    try {
      await onSelect(subscription)
    } finally {
      setSelectedSubscriptionId(null)
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">{t("SELECT_SUBSCRIPTION.error")}</div>
    )
  }

  if (!data?.subscriptions?.length && !isLoading) {
    return <div className="p-4">{t("SELECT_SUBSCRIPTION.noSubscriptions")}</div>
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
          data.subscriptions.map((subscription) => (
            <Button
              key={subscription._id}
              variant="outline"
              className="w-full justify-start gap-2 h-14 p-2"
              onClick={() => handleSubscriptionSelect(subscription)}
              disabled={selectedSubscriptionId === subscription._id}
            >
              {selectedSubscriptionId === subscription._id ? (
                <AnimatedReload />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {t("SELECT_SUBSCRIPTION.subscriptionNumber", {
                    number: formatIdForDisplay(subscription),
                  })}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(subscription.createdAt), "PPP")} -{" "}
                  <span
                    className={`text-sm rounded-md text-white px-2 py-1 ${getSubscriptionStatusColor(
                      subscription.stripe.status
                    )}`}
                  >
                    {t(`status.${subscription.stripe.status}`)}
                  </span>
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
            disabled={page === 1 || selectedSubscriptionId !== null}
          >
            {t("SELECT_SUBSCRIPTION.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={
              page * limit >= data.total || selectedSubscriptionId !== null
            }
          >
            {t("SELECT_SUBSCRIPTION.next")}
          </Button>
        </div>
      )}
    </div>
  )
}
