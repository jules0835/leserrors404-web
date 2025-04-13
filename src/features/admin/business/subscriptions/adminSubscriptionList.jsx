"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams, useRouter } from "next/navigation"
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
import { getSubscriptionStatusColor } from "@/features/user/business/subscriptions/utils/subscription"
import AdminSubscriptionsFilterBar from "@/features/admin/business/subscriptions/adminSubscriptionFilterBar"
import { useState } from "react"

export default function AdminSubscriptionList() {
  const t = useTranslations("Admin.Business.Subscriptions")
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = parseInt(searchParams.get("page"), 10) || 1
  const limit = 10
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortSubscription = searchParams.get("sortSubscription") || "desc"
  const status = searchParams.get("status") || "all"
  const search = searchParams.get("search") || ""
  const [date, setDate] = useState(null)
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminSubscriptions",
      page,
      sortField,
      sortSubscription,
      status,
      search,
      date,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/subscriptions?page=${page}&limit=${limit}&sortField=${sortField}&sortSubscription=${sortSubscription}&status=${status}&search=${search}&date=${date ? date.toISOString() : ""}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }

      return response.json()
    },
  })
  const handleSort = (field) => {
    const params = new URLSearchParams(searchParams)

    if (sortField === field) {
      params.set(
        "sortSubscription",
        sortSubscription === "asc" ? "desc" : "asc"
      )
    } else {
      params.set("sortField", field)
      params.set("sortSubscription", "asc")
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
    params.set("sortSubscription", "desc")
    setDate(null)
    router.push(`?${params.toString()}`)
  }
  const columns = [
    {
      accessorKey: "_id",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("_id")}>
          {t("subscriptionId")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("_id")}</div>
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
      accessorKey: "stripe.status",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("stripe.status")}>
          {t("Status.title")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionStatusColor(
              row.original.stripe.status
            )} text-white`}
          >
            {t(`Status.${row.original.stripe.status}`)}
          </span>
          {row.original.stripe.status === "active" &&
            row.original.stripe.canceledAt && (
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-500 text-white`}
              >
                {t("status.preCanceled")}
              </span>
            )}
        </span>
      ),
    },
    {
      accessorKey: "items",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("items")}>
          {t("products")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.items.map((item) => (
            <div key={item._id}>
              {item.productId.label.en} ({item.billingCycle})
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link
          href={`/admin/business/subscriptions/${row.original._id}`}
          className="text-primary hover:text-primary-dark"
        >
          <CircleChevronRight />
        </Link>
      ),
    },
  ]
  const table = useReactTable({
    data: data?.subscriptions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      <AdminSubscriptionsFilterBar
        status={status}
        onStatusChange={handleStatusChange}
        search={search}
        date={date}
        setDate={setDate}
        handleResetClick={handleResetClick}
        handleSearch={handleSearch}
      />

      <div className="rounded-md border">
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
                  {t("errorLoadingSubscriptions")}
                </TableCell>
              </TableRow>
            )}
            {!error && !isLoading && table.getRowModel().rows?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noSubscriptions")}
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-1 w-full space-y-7"
                >
                  <DataGridSkeleton rows={1} cells={6} />
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
