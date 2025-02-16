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
import {
  useChangeActiveUserStatus,
  useChangeConfirmedUserStatus,
} from "@/features/admin/security/users/utils/users"
import { useRouter } from "@/i18n/routing"
import { useEffect } from "react"

export default function UsersList() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [query, setQuery] = useState("")
  const [total, setTotal] = useState(0)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const router = useRouter()
  const { mutate: changeActiveUserStatus, data: updatedActiveUser } =
    useChangeActiveUserStatus()
  const { mutate: changeConfirmedUserStatus, data: updatedConfirmedUser } =
    useChangeConfirmedUserStatus()

  useEffect(() => {
    if (updatedActiveUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedActiveUser._id ? updatedActiveUser : user
        )
      )
    }
  }, [updatedActiveUser])

  useEffect(() => {
    if (updatedConfirmedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedConfirmedUser._id ? updatedConfirmedUser : user
        )
      )
    }
  }, [updatedConfirmedUser])

  const [columnVisibility, setColumnVisibility] = useState({
    firstName: true,
    lastName: true,
    country: false,
    city: false,
    zipCode: false,
    phone: true,
    email: true,
    isActive: true,
    isSuperAdmin: true,
    isAdmin: true,
    isConfirmed: true,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [users, setUsers] = useState([])
  const t = useTranslations("Admin.Security.Users")
  const { isLoading, error } = useQuery({
    queryKey: ["users", page, limit, query],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/security/users?limit=${limit}&page=${page}&query=${query}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const { users: usersList, total: totalList } = await response.json()

      setUsers(usersList)
      setTotal(totalList)

      return users
    },
  })
  const columns = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("firstName")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("lastName")} <ArrowUpDown />
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("email")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "account.activation.isActivated",
      header: t("isActive"),
      cell: ({ row }) => (
        <div>
          {row.original.account.activation.isActivated ? t("yes") : t("no")}
        </div>
      ),
    },
    {
      accessorKey: "account.confirmation.isConfirmed",
      header: t("isConfirmed"),
      cell: ({ row }) => (
        <div>
          {row.original.account.confirmation.isConfirmed ? t("yes") : t("no")}
        </div>
      ),
    },
    {
      accessorKey: "isAdmin",
      header: t("isAdmin"),
      cell: ({ row }) => (
        <div>{row.getValue("isAdmin") ? t("yes") : t("no")}</div>
      ),
    },
    {
      accessorKey: "isSuperAdmin",
      header: t("isSuperAdmin"),
      cell: ({ row }) => (
        <div>{row.getValue("isSuperAdmin") ? t("yes") : t("no")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

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
                onClick={() => router.push(`/admin/security/users/${user._id}`)}
              >
                {t("viewUser")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  changeActiveUserStatus({
                    userId: user._id,
                    status: !user.account.activation.isActivated,
                  })
                }
                className={`${
                  user.account.activation.isActivated
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {user.account.activation.isActivated
                  ? t("desactivateUser")
                  : t("activateUser")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  changeConfirmedUserStatus({
                    userId: user._id,
                    status: !user.account.confirmation.isConfirmed,
                  })
                }
                className={`${
                  user.account.confirmation.isConfirmed
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {user.account.confirmation.isConfirmed
                  ? t("unconfirmUser")
                  : t("confirmUser")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const table = useReactTable({
    data: users || [],
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
