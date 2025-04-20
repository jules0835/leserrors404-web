"use client"
import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowRight, ArrowUpDown, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useTitle } from "@/components/navigation/titleContext"

export default function AdminCustomerList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("Admin.Business.Customers")
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const page = parseInt(searchParams.get("page"), 10) || 1
  const limit = 10
  const query = searchParams.get("query") || ""
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const [columnVisibility, setColumnVisibility] = useState({
    firstName: true,
    lastName: true,
    country: false,
    city: false,
    zipCode: false,
    phone: true,
    email: true,
    createdAt: true,
    orderCount: true,
    activeSubscriptionCount: true,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const { isLoading, error } = useQuery({
    queryKey: ["customers", page, limit, query, sortField, sortOrder],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/customers?limit=${limit}&page=${page}&query=${query}&sortField=${sortField}&sortOrder=${sortOrder}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const { customers: customersList, total: totalList } =
        await response.json()
      setCustomers(customersList)
      setTotal(totalList)

      return { customers: customersList, total: totalList }
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

    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set("query", e.target.value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  const columns = [
    {
      accessorKey: "firstName",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("firstName")}>
          {t("firstName")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("lastName")}>
          {t("lastName")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "country",
      header: t("country"),
      cell: ({ row }) => <div>{row.getValue("country")}</div>,
    },
    {
      accessorKey: "city",
      header: t("city"),
      cell: ({ row }) => <div>{row.getValue("city")}</div>,
    },
    {
      accessorKey: "zipCode",
      header: t("zipCode"),
      cell: ({ row }) => <div>{row.getValue("zipCode")}</div>,
    },
    {
      accessorKey: "phone",
      header: t("phone"),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("email")}>
          {t("email")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ _column }) => (
        <Button variant="ghost" onClick={() => handleSort("createdAt")}>
          {t("createdAt")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleString("fr-FR")}</div>
      ),
    },
    {
      accessorKey: "orderCount",
      header: t("orders"),
      cell: ({ row }) => <div>{row.getValue("orderCount")}</div>,
    },
    {
      accessorKey: "activeSubscriptionCount",
      header: t("subscriptions"),
      cell: ({ row }) => <div>{row.getValue("activeSubscriptionCount")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original

        return (
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/admin/business/customers/${customer._id}`)
            }
          >
            {t("viewDetails")} <ArrowRight className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]
  const table = useReactTable({
    data: customers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { columnVisibility, rowSelection },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("columns")} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(Boolean(value))
                  }
                >
                  {t(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                  {t("errorLoadingData")}
                </TableCell>
              </TableRow>
            )}
            {!error && !isLoading && table.getRowModel().rows?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-1 w-full space-y-7"
                >
                  <DataGridSkeleton rows={1} cells={8} />
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
                (page * limit < total ? page + 1 : page).toString()
              )
              router.push(`?${params.toString()}`)
            }}
            disabled={page * limit >= total}
          >
            {t("next")}
          </Button>
        </div>
      </div>
    </div>
  )
}
