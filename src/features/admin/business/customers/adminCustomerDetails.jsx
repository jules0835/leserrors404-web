"use client"

import * as React from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerOrders from "@/features/admin/business/customers/CustomerOrders"
import CustomerSubscriptions from "@/features/admin/business/customers/CustomerSubscriptions"
import CustomerDetailsSkeleton from "@/features/admin/business/customers/CustomerDetailsSkeleton"
import {
  ArrowRight,
  CircleUser,
  Package,
  Repeat2,
  TicketCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { useTitle } from "@/components/navigation/titleContext"

export default function AdminCustomerDetails() {
  const params = useParams()
  const t = useTranslations("Admin.Business.Customers")
  const locale = useLocale()
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", params.Id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/business/customers/${params.Id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch customer details")
      }

      return response.json()
    },
  })
  const {
    mutateAsync: openClientPortal,
    isPending: isFetchingOpenClientPortal,
  } = useMutation({
    mutationFn: async () => {
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/admin/business/customers/${params.Id}`
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/user/dashboard/business/invoices/${params.Id}/portal?returnUrl=${returnUrl}`
      )
      const dataPortal = await response.json()

      if (dataPortal.portalUrl) {
        window.open(dataPortal.portalUrl, "_blank")
      } else {
        toast.error(t("portalNotFound"))
      }
    },
  })

  if (isLoading) {
    return <CustomerDetailsSkeleton />
  }

  if (error || !data?.customer) {
    return <div>Error loading customer details</div>
  }

  const { customer, orders, subscriptions } = data

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CircleUser className="h-5 w-5" />
              <span>{t("customerDetails")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h2 className="text-xl font-semibold">
                {`${customer.firstName} ${customer.lastName}`}
              </h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-500">
                {t("created", {
                  date: new Date(customer.createdAt).toLocaleString("fr-FR"),
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>{t("countCustomerOrders")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Repeat2 className="h-5 w-5" />
              <span>{t("countCustomerSubscriptions")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions?.filter((sub) => sub.stripe.status === "active")
                .length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TicketCheck className="h-5 w-5" />
              <span>{t("countCustomerTickets")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="mt-3">
          <div className="flex justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 w-full items-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("firstName")}
                </p>
                <p className="text-sm">{customer.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("lastName")}
                </p>
                <p className="text-sm">{customer.lastName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("email")}
                </p>
                <p className="text-sm">{customer.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("phone")}
                </p>
                <p className="text-sm">{customer.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("country")}
                </p>
                <p className="text-sm">{customer.address?.country}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{t("city")}</p>
                <p className="text-sm">{customer.address?.city}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("zipCode")}
                </p>
                <p className="text-sm">{customer.address?.zipCode}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("street")}
                </p>
                <p className="text-sm">{customer.address?.street}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {t("company")}
                </p>
                <p className="text-sm">{customer.company}</p>
              </div>
            </div>
            <div className="w-[500px]">
              <h1 className="text-lg font-semibold">{t("actions")}</h1>
              <div className="gap-2 flex flex-col mt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!customer?.account?.stripe?.customerId}
                  onClick={() => {
                    window.open(
                      `https://dashboard.stripe.com/customers/${customer.account.stripe.customerId}`,
                      "_blank"
                    )
                  }}
                >
                  {t("viewOnStripe")} <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!customer?.account?.stripe?.customerId}
                  onClick={() => {
                    openClientPortal()
                  }}
                >
                  {t("openClientStripePortal")}{" "}
                  {isFetchingOpenClientPortal ? (
                    <AnimatedReload />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>

                {!customer?.account?.stripe?.customerId && (
                  <p className="text-sm text-red-500 text-center font-medium">
                    {t("noStripeCustomerId")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerOrders orders={orders} />
        <CustomerSubscriptions subscriptions={subscriptions} />
      </div>
    </div>
  )
}
