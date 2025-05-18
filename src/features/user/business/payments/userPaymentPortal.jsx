"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  CreditCard,
  Receipt,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { format } from "date-fns"
import DButton from "@/components/ui/DButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "@/i18n/routing"
import ErrorFront from "@/components/navigation/error"
import { useTitle } from "@/components/navigation/titleContext"

export default function UserPaymentPortal() {
  const t = useTranslations("User.Business.Payments")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()
  const locale = useLocale()
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data, isLoading, error } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await fetch("/api/user/dashboard/business/payments")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch payment data")
      }

      return response.json()
    },
  })
  const { mutateAsync: openInvoice, isPending: isOpeningInvoice } = useMutation(
    {
      mutationFn: async (invoiceId) => {
        const response = await fetch(
          `/api/user/dashboard/business/invoices/${invoiceId}`
        )

        if (!response.ok) {
          throw new Error("Failed to open invoice")
        }

        const dataInvoice = await response.json()
        window.open(dataInvoice.invoiceUrl, "_blank")
      },
    }
  )
  const { mutateAsync: openPortal, isPending: isOpeningPortal } = useMutation({
    mutationFn: async () => {
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/user/dashboard/business/payments`
      const response = await fetch(
        `/api/user/dashboard/business/invoices/${userId}/portal?returnUrl=${returnUrl}`
      )

      if (!response.ok) {
        throw new Error("Failed to open portal")
      }

      const dataPortal = await response.json()
      router.push(dataPortal.portalUrl)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="h-20 bg-muted rounded-md animate-pulse" />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-muted rounded-md animate-pulse"
                />
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-muted rounded-md animate-pulse"
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorFront />
  }

  const paymentMethods = data?.paymentMethods?.data || []
  const invoices = data?.invoices?.data || []
  const hasPortalAccess = data?.hasPortalAccess
  const userId = data?.userId
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(invoices.length / itemsPerPage)

  return (
    <div className="space-y-6 px-4">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">{t("paymentPortal")}</h2>
            <p className="text-muted-foreground">
              {t("paymentPortalDescription")}
            </p>
          </div>
          <div className="flex justify-center md:justify-start">
            <DButton
              onClickBtn={() => openPortal()}
              isDisabled={!hasPortalAccess || isOpeningPortal}
              isLoading={isOpeningPortal}
              isMain
              className="w-full md:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("openStripePortal")}
            </DButton>
          </div>
        </div>
        {!hasPortalAccess && (
          <Alert className="mt-4 border-green-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-1">
              {t("stripePortalInactive")}
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <CreditCard className="h-5 w-5" />
            <h3 className="text-lg font-semibold">
              {t("savedPaymentMethods")}
            </h3>
          </div>
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t("noPaymentMethods")}
              </p>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col md:flex-row items-center justify-between p-3 border rounded-lg text-center md:text-left"
                >
                  <div className="flex flex-col md:flex-row items-center gap-3 mb-2 md:mb-0">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        •••• •••• •••• {method.card.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.card.brand} - {t("expires")}{" "}
                        {method.card.exp_month}/{method.card.exp_year}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <Receipt className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t("invoices")}</h3>
          </div>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t("noInvoices")}
            </p>
          ) : (
            <>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center md:text-left">
                        {t("date")}
                      </TableHead>
                      <TableHead className="text-center md:text-left">
                        {t("amount")}
                      </TableHead>
                      <TableHead className="text-center md:text-left">
                        {t("status")}
                      </TableHead>
                      <TableHead className="text-center md:text-right">
                        {t("actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="text-center md:text-left">
                          {format(new Date(invoice.created * 1000), "PPP")}
                        </TableCell>
                        <TableCell className="text-center md:text-left">
                          {(invoice.amount_paid / 100).toFixed(2)}{" "}
                          {invoice.currency.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-center md:text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center md:text-right">
                          <DButton
                            onClickBtn={() => openInvoice(invoice.id)}
                            isDisabled={isOpeningInvoice}
                            isLoading={isOpeningInvoice}
                            variant="outline"
                            size="sm"
                            className="w-full md:w-auto"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            {t("viewInvoice")}
                          </DButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4">
                {totalPages > 1 && (
                  <div className="flex items-center justify-center md:justify-end space-x-2 py-4">
                    <DButton
                      onClickBtn={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      isDisabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      {t("previous")}
                    </DButton>
                    <DButton
                      onClickBtn={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      isDisabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      {t("next")}
                    </DButton>
                  </div>
                )}
                {hasPortalAccess && (
                  <Alert className="mt-2">
                    <AlertDescription className="flex items-center justify-between">
                      <AlertCircle className="h-6 w-6 mr-3" />
                      <p>{t("olderInvoicesMessage")}</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
