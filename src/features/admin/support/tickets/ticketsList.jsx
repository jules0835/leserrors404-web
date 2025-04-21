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
import { Badge } from "@/components/ui/badge"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { getTicketsList } from "@/features/admin/support/service/adminChatService"
import { useSearchParams } from "next/navigation"
import { formatIdForDisplay } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function TicketsList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("Admin.Support.Tickets")
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const page = parseInt(searchParams.get("page"), 10) || 1
  const limit = 10
  const query = searchParams.get("query") || ""
  const sortField = searchParams.get("sortField") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const isActive = searchParams.get("isActive") === "true"
  const [columnVisibility, setColumnVisibility] = useState({
    user: true,
    status: true,
    responseTime: true,
    createdAt: true,
    lastMessageType: true,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [tickets, setTickets] = useState([])
  const [total, setTotal] = useState(0)
  const { isLoading, error } = useQuery({
    queryKey: ["tickets", page, limit, query, sortField, sortOrder, isActive],
    queryFn: async () => {
      const { tickets: ticketsList, total: totalList } = await getTicketsList({
        limit,
        page,
        query,
        sortField,
        sortOrder,
        isActive,
      })

      setTickets(ticketsList)
      setTotal(totalList)

      return { tickets: ticketsList, total: totalList }
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
  const toggleActiveFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.set("isActive", (!isActive).toString())
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  const calculateResponseTime = (ticket) => {
    if (!ticket.isActive) {
      const start = new Date(ticket.createdAt)
      const end = new Date(ticket.endedAt)
      const diff = end - start
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return `${hours}h ${minutes}m`
    }

    const start = new Date(ticket.createdAt)
    const now = new Date()
    const diff = now - start
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }
  const getLastMessageType = (ticket) => {
    const lastMessage = ticket.messages[ticket.messages.length - 1]

    if (!lastMessage) {
      return null
    }

    if (lastMessage.isAction) {
      return {
        type: "action",
        isDone: lastMessage.isActionDone,
      }
    }

    return {
      type: lastMessage.sender.toLowerCase(),
    }
  }
  const columns = [
    {
      accessorKey: "ticketId",
      header: t("ticketId"),
      cell: ({ row }) => {
        const ticket = row.original

        return <div>#{formatIdForDisplay(ticket)}</div>
      },
    },
    {
      accessorKey: "user",
      header: t("user"),
      cell: ({ row }) => {
        const ticket = row.original

        return (
          <div>
            {ticket.user
              ? `${ticket.user.firstName} ${ticket.user.lastName}`
              : ticket.userName || "-"}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const ticket = row.original

        return (
          <Badge
            variant="outline"
            className={`${
              ticket.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {ticket.isActive ? t("open") : t("closed")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "responseTime",
      header: t("responseTime"),
      cell: ({ row }) => {
        const ticket = row.original

        return <div>{calculateResponseTime(ticket)}</div>
      },
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
      accessorKey: "lastMessageType",
      header: t("lastMessageType"),
      cell: ({ row }) => {
        const ticket = row.original
        const messageType = getLastMessageType(ticket)

        if (!messageType) {
          return <div>-</div>
        }

        if (messageType.type === "action") {
          return (
            <Badge
              variant="outline"
              className={`${
                messageType.isDone
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {messageType.isDone ? t("actionDone") : t("waitingAction")}
            </Badge>
          )
        }

        const badgeStyles = {
          user: "bg-blue-100 text-blue-800",
          admin: "bg-purple-100 text-purple-800",
          bot: "bg-gray-100 text-gray-800",
        }

        return (
          <Badge
            variant="outline"
            className={`${badgeStyles[messageType.type]}`}
          >
            {t(messageType.type)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const ticket = row.original

        return (
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/support/inbox/${ticket._id}`)}
          >
            {t("viewDetails")} <ArrowRight className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]
  const table = useReactTable({
    data: tickets || [],
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
      <div className="flex items-center mb-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button
          variant={isActive ? "default" : "outline"}
          onClick={toggleActiveFilter}
          className="ml-2"
        >
          {t("activeTickets")}
        </Button>
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
