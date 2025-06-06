"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams, useRouter } from "next/navigation"
import { getStatusColor } from "@/features/user/business/orders/utils/userOrder"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CircleChevronRight } from "lucide-react"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import AdminOrdersFilterBar from "@/features/admin/business/orders/adminOrdersFilterBar"
import { useState } from "react"
import { formatIdForDisplay } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"
export default function AdminOrderList() {
  const t = useTranslations("Admin.Business.Orders")
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = parseInt(searchParams.get("page"), 10) || 1
  const limit = 10
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const status = searchParams.get("status") || "all"
  const search = searchParams.get("search") || ""
  const [date, setDate] = useState(null)
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminOrders", page, sortField, sortOrder, status, search, date],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/orders?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&status=${status}&search=${search}&date=${date ? date.toISOString() : ""}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      return response.json()
    },
  })
  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams)

    if (sortField === field) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", field)
      params.set("sortOrder", "asc")
    }

    router.push(`?${params.toString()}`)
  }
  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set("search", e.target.value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  const handleStatusChange = (value) => {
    const params = new URLSearchParams(searchParams)
    params.set("status", value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  const handleResetClick = () => {
    const params = new URLSearchParams(searchParams)
    params.set("search", "")
    params.set("status", "all")
    params.set("page", "1")
    params.set("date", "")
    params.set("sortField", "createdAt")
    params.set("sortOrder", "desc")
    setDate(null)
    router.push(`?${params.toString()}`)
  }
  const columns = [
    {
      accessorKey: "_id",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("_id")}>
          {t("orderId")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">#{formatIdForDisplay(row.original)}</div>
      ),
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => {
        const { user } = row.original

        return (
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("createdAt")}>
          {t("date")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleString("fr-FR")}</div>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("orderStatus")}>
          {t("status.title")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
            row.getValue("orderStatus")
          )} text-white`}
        >
          {t(`Status.${row.getValue("orderStatus").toLowerCase()}`)}
        </span>
      ),
    },
    {
      accessorKey: "stripe.amountTotal",
      header: ({ _column }) => (
        <Button
          variant="ghost"
          onClick={() => handleSort("stripe.amountTotal")}
        >
          {t("total")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.stripe.amountTotal.toFixed(2)}{" "}
          {row.original.stripe.currency.toUpperCase()}
        </div>
      ),
    },
    {
      accessorKey: "subscription",
      header: "Subscription",
      cell: ({ row }) => {
        const hasSubscription =
          row.original.stripe?.subscriptionId && row.original.subscription

        return (
          <div>
            {hasSubscription ? (
              <Link
                href={`/admin/business/subscriptions/${row.original.subscription._id}`}
                className="text-primary hover:text-primary-dark"
              >
                View Subscription
              </Link>
            ) : (
              <span className="text-gray-500">No subscription</span>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link
          href={`/admin/business/orders/${row.original._id}`}
          className="text-primary hover:text-primary-dark"
        >
          <CircleChevronRight />
        </Link>
      ),
    },
  ]
  const table = useReactTable({
    data: data?.orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      <AdminOrdersFilterBar
        status={status}
        onStatusChange={handleStatusChange}
        search={search}
        date={date}
        setDate={setDate}
        handleResetClick={handleResetClick}
        handleSearch={handleSearch}
      />

      <div className="rounded-md border overflow-hidden grid">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("errorLoadingOrders")}
                  </TableCell>
                </TableRow>
              )}
              {!error &&
                !isLoading &&
                table.getRowModel().rows?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("noOrders")}
                    </TableCell>
                  </TableRow>
                )}
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-1 w-full space-y-7"
                  >
                    <DataGridSkeleton rows={1} cells={7} />
                  </TableCell>
                </TableRow>
              )}
              {!error &&
                !isLoading &&
                table.getRowModel().rows?.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {data?.total > limit && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("page", Math.max(page - 1, 1).toString())
                router.push(`?${params.toString()}`)
              }}
              disabled={page === 1}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set(
                  "page",
                  (page * limit < data.total ? page + 1 : page).toString()
                )
                router.push(`?${params.toString()}`)
              }}
              disabled={page * limit >= data.total}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
