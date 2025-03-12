/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
"use client"
import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useRouter } from "@/i18n/routing"
import NewVoucher from "./newVoucher"
import toast from "react-hot-toast"

export default function VouchersList() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [query, setQuery] = useState("")
  const [total, setTotal] = useState(0)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const router = useRouter()
  const [columnVisibility, setColumnVisibility] = useState({
    code: true,
    discount: true,
    expirationDate: true,
    isActive: true,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [vouchers, setVouchers] = useState([])
  const t = useTranslations("Admin.Business.Vouchers")
  const { isLoading, error, refetch } = useQuery({
    queryKey: ["vouchers", page, limit, query],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/vouchers?limit=${limit}&page=${page}&query=${query}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch vouchers")
      }

      const { vouchers: vouchersList, total: totalList } = await response.json()

      setVouchers(vouchersList)
      setTotal(totalList)

      return vouchers
    },
  })
  const handleVoucherCreated = () => {
    refetch()
  }
  const handleChangeVoucherStatus = async (voucherId, isActive) => {
    try {
      const response = await fetch(
        `/api/admin/business/vouchers/${voucherId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isActive }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to change voucher status")
      }

      toast.success(t("voucherStatusChanged"))
      refetch()
    } catch (changeStatusError) {
      toast.error(t("voucherStatusChangeFailed"))
    }
  }
  const columns = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("code")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("type")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("amount")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("amount")}</div>,
    },
    {
      accessorKey: "minPurchaseAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("minPurchaseAmount")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("minPurchaseAmount")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("description")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("isActive")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("isActive") ? t("yes") : t("no")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("createdAt")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("updatedAt")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const voucher = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/business/vouchers/${voucher._id}`)
                }
              >
                {t("viewVoucher")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={`${
                  voucher.isActive ? "text-red-700" : "text-green-700"
                }`}
                onClick={() =>
                  handleChangeVoucherStatus(voucher._id, !voucher.isActive)
                }
              >
                {voucher.isActive
                  ? t("deactivateVoucher")
                  : t("activateVoucher")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const table = useReactTable({
    data: vouchers || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
        <NewVoucher onVoucherCreated={handleVoucherCreated} />
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
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => (prev * limit < total ? prev + 1 : prev))
            }
            disabled={page * limit >= total}
          >
            {t("next")}
          </Button>
        </div>
      </div>
    </div>
  )
}
