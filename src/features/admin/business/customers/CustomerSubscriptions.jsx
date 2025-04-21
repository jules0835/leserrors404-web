"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import { formatIdForDisplay } from "@/lib/utils"

export default function CustomerSubscriptions({ subscriptions }) {
  const t = useTranslations("Admin.Business.Customers")
  const [page, setPage] = useState(1)
  const limit = 10
  const totalPages = Math.ceil((subscriptions?.length || 0) / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const currentSubscriptions = subscriptions?.slice(startIndex, endIndex) || []

  if (!subscriptions?.length) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">{t("subscriptions")}</h3>
        <p className="text-gray-500">{t("noSubscriptions")}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{t("subscriptions")}</h3>
      </div>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("subscriptionId")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("endDate")}</TableHead>
              <TableHead>{t("status.title")}</TableHead>
              <TableHead>{t("billingCycle")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSubscriptions.map((subscription) => (
              <TableRow key={subscription._id}>
                <TableCell className="font-medium">
                  #{formatIdForDisplay(subscription)}
                </TableCell>
                <TableCell>
                  {new Date(subscription.stripe.periodStart).toLocaleString(
                    "fr-FR"
                  )}
                </TableCell>
                <TableCell>
                  {new Date(subscription.stripe.periodEnd).toLocaleString(
                    "fr-FR"
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionStatusColor(
                      subscription.stripe.status
                    )}`}
                  >
                    {t(`Status.${subscription.stripe.status}`)}
                  </span>
                </TableCell>
                <TableCell>
                  {subscription.items[0]?.billingCycle === "monthly"
                    ? t("monthly")
                    : t("annual")}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/business/subscriptions/${subscription._id}`}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    {t("viewDetails")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  )
}
