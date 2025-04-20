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
import { useTitle } from "@/components/navigation/titleContext"

export default function UserSubscriptionList() {
  const t = useTranslations("User.Business.Subscriptions")
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = parseInt(searchParams.get("page"), 10) || 1
  const limit = 10
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptions", page, sortField, sortOrder],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/dashboard/business/subscriptions?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
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
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc")
    } else {
      params.set("sortField", field)
      params.set("sortOrder", "asc")
    }

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
      accessorKey: "createdAt",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("createdAt")}>
          {t("date")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "stripe.status",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("stripe.status")}>
          {t("status.title")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionStatusColor(
            row.original.stripe.status
          )} text-white`}
        >
          {row.original.stripe.status}
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
          href={`/user/dashboard/business/subscriptions/${row.original._id}`}
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
                  <DataGridSkeleton rows={1} cells={5} />
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
        <div className="flex justify-center space-x-2">
          {Array.from(
            { length: Math.ceil(data.total / limit) },
            (_, i) => i + 1
          ).map((pageNum) => (
            <Link
              key={pageNum}
              href={`?${new URLSearchParams({
                ...Object.fromEntries(searchParams),
                page: pageNum.toString(),
              }).toString()}`}
              className={`px-4 py-2 rounded ${
                pageNum === page
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
