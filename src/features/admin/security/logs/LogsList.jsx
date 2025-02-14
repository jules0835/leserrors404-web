/* eslint-disable max-lines-per-function */
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
import { ArrowUpDown, ChevronDown, SquareX, CalendarIcon } from "lucide-react"
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
import {
  getLogKeyTitle,
  getLogLevelTitle,
  getBackgroundColor,
  returnIconLogLevel,
} from "@/features/admin/security/logs/utils/logs"
import toast from "react-hot-toast"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { trimString } from "@/lib/utils"
import { useRouter } from "@/i18n/routing"
import LogsFilterBar from "@/features/admin/security/logs/LogsFilterBar"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function LogsList() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [query, setQuery] = useState("")
  const [total, setTotal] = useState(0)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [selectedLogKeys, setSelectedLogKeys] = useState([])
  const [selectedCriticalityKey, setSelectedCriticalityKey] = useState("")
  const [columnVisibility, setColumnVisibility] = useState({
    logLevel: true,
    logKey: true,
    message: true,
    technicalMessage: false,
    isError: true,
    isAdminAction: false,
    deviceType: false,
    userId: true,
    date: true,
    data: false,
    oldData: false,
    newData: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [logs, setLogs] = useState([])
  const t = useTranslations("Admin.Security.Logs")
  const [filter, setFilter] = useState("")
  const router = useRouter()
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }
  const handleLogKeyChange = (keys) => {
    setSelectedLogKeys(keys)
  }
  const [selectedDate, setSelectedDate] = useState(null)
  const { isLoading, error, refetch } = useQuery({
    queryKey: [
      "logs",
      page,
      limit,
      query,
      sorting,
      filter,
      selectedLogKeys,
      selectedDate,
    ],
    queryFn: async () => {
      const sortField = sorting[0]?.id || "date"
      const sortOrder = sorting[0]?.desc ? "desc" : "asc"
      const dateFilter = selectedDate
        ? `&date=${selectedDate.toISOString()}`
        : ""
      const response = await fetch(
        `/api/admin/security/logs?limit=${limit}&page=${page}&query=${query}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&logKeys=${selectedLogKeys.join(
          ","
        )}${dateFilter}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch logs")
      }

      const { logs: logsList, total: totalList } = await response.json()

      setLogs(logsList)
      setTotal(totalList)

      return logs
    },
  })
  const columns = [
    {
      accessorKey: "icon",
      header: "",
      cell: ({ row }) => returnIconLogLevel(row.getValue("logLevel")),
    },
    {
      accessorKey: "logLevel",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("logLevel")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{getLogLevelTitle(row.getValue("logLevel"), t)}</div>
      ),
    },
    {
      accessorKey: "logKey",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("logKey")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{getLogKeyTitle(row.getValue("logKey"), t)}</div>,
    },
    {
      accessorKey: "message",
      header: t("message"),
      cell: ({ row }) => <div>{trimString(row.getValue("message"), 30)}</div>,
    },
    {
      accessorKey: "technicalMessage",
      header: t("technicalMessage"),
      cell: ({ row }) => <div>{row.getValue("technicalMessage")}</div>,
    },
    {
      accessorKey: "isError",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("isError")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("isError") ? t("yes") : t("no")}</div>
      ),
    },
    {
      accessorKey: "isAdminAction",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("isAdminAction")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue("isAdminAction") ? t("yes") : t("no")}</div>
      ),
    },
    {
      accessorKey: "deviceType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("deviceType")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("deviceType")}</div>,
    },
    {
      accessorKey: "userName",
      header: t("userName"),
      cell: ({ row }) => <div>{row.getValue("userName")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("date")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("date")).toLocaleString("fr-FR")}</div>
      ),
    },
    {
      accessorKey: "data",
      header: t("data"),
      cell: ({ row }) => <div>{JSON.stringify(row.getValue("data"))}</div>,
    },
    {
      accessorKey: "oldData",
      header: t("oldData"),
      cell: ({ row }) => <div>{JSON.stringify(row.getValue("oldData"))}</div>,
    },
    {
      accessorKey: "newData",
      header: t("newData"),
      cell: ({ row }) => <div>{JSON.stringify(row.getValue("newData"))}</div>,
    },
  ]
  const table = useReactTable({
    data: logs || [],
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
  const reloadData = () => {
    toast.promise(refetch(), {
      loading: t("reLoadingLogs"),
      success: t("LogsReloaded"),
      error: t("errorLoadingLogs"),
    })
  }
  const handleResetClick = () => {
    setQuery("")
    setPage(1)
    setSorting([])
    setColumnFilters([])
    setRowSelection({})
    setSelectedCriticalityKey("")
    setSelectedLogKeys([])
    handleFilterChange("")
    handleLogKeyChange([])
    setSelectedDate(null)
    toast.success(t("resetFilters"))
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="ml-2">
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>{t("pickDate")}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
        <Button variant="outline" className="ml-2" onClick={reloadData}>
          <AnimatedReload />
        </Button>
        <Button variant="outline" className="ml-2" onClick={handleResetClick}>
          <SquareX />
        </Button>
      </div>
      <div className="w-full">
        <LogsFilterBar
          onFilterChange={handleFilterChange}
          onLogKeyChange={handleLogKeyChange}
          selectedLogKeys={selectedLogKeys}
          selectedCriticalityKey={selectedCriticalityKey}
          setSelectedLogKeys={setSelectedLogKeys}
          setSelectedCriticalityKey={setSelectedCriticalityKey}
        />
      </div>
      <div className="rounded-md border mt-4">
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
              table.getRowModel().rows.map((row) => {
                const isVisible =
                  (!filter || row.original.logLevel === filter) &&
                  (selectedLogKeys.length === 0 ||
                    selectedLogKeys.includes(row.original.logKey))

                return (
                  isVisible && (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`${getBackgroundColor(
                        row.original.logLevel
                      )} cursor-pointer truncate`}
                      onClick={() =>
                        router.push(`/admin/security/logs/${row.original._id}`)
                      }
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
                  )
                )
              })}
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
