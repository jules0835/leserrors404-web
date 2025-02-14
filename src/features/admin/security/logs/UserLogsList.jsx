"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  returnIconLogLevel,
  getLogKeyTitle,
  getBackgroundColor,
} from "@/features/admin/security/logs/utils/logs"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useRouter } from "@/i18n/routing"
import { SquareArrowOutUpRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import ListSkeleton from "@/components/skeleton/ListSkeleton"

export default function UserLogsList({ userId }) {
  const [page, setPage] = useState(1)
  const limit = 5
  const t = useTranslations("Admin.Security.Logs")
  const router = useRouter()
  const { data, isLoading, error } = useQuery({
    queryKey: ["userLogs", userId, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/security/users/${userId}/logs?limit=${limit}&page=${page}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch logs")
      }

      return response.json()
    },
    keepPreviousData: true,
  })
  const logs = data?.logs ?? []
  const total = data?.total ?? 0

  return (
    <div>
      {isLoading && <ListSkeleton rows={5} py={3} height={8} parts={3} />}
      {error && <p className="text-center my- py-4">{t("errorLoadingLogs")}</p>}
      <ul>
        {logs.map((log) => (
          <li
            key={log._id}
            className={`flex items-center space-x-4 p-2 border-b ${getBackgroundColor(
              log.logLevel
            )}`}
          >
            {returnIconLogLevel(log.logLevel)}
            <div className="flex-grow">
              <p>{getLogKeyTitle(log.logKey, t)}</p>
              <p>{log.message}</p>
              <p>{format(new Date(log.date), "PPP p")}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/security/logs/${log._id}`)}
            >
              <SquareArrowOutUpRight />
            </Button>
          </li>
        ))}
      </ul>
      <div>
        {logs && logs.length === 0 && !isLoading && (
          <p className="text-center py-4">{t("noLogs")}</p>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          {t("previous")}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setPage((prev) => (prev * limit < total ? prev + 1 : prev))
          }
          disabled={page * limit >= total || isLoading}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  )
}
