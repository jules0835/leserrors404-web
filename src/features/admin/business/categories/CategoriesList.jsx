"use client"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import CategorieAdd from "@/features/admin/business/categories/categorieAdd"
import CategorieEdit from "@/features/admin/business/categories/categorieEdit"
import { Button } from "@/components/ui/button"
import * as React from "react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useTranslations, useLocale } from "next-intl"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { getLocalizedValue, trimString } from "@/lib/utils"
import { useTitle } from "@/components/navigation/titleContext"

export default function CategoriesList() {
  const locale = useLocale()
  const t = useTranslations("Admin.Business.Categories")
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState([])
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [editCategory, setEditCategory] = useState(null)
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { isLoading, error } = useQuery({
    queryKey: ["categories", page, limit, query],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/categories?limit=${limit}&page=${page}&query=${query}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const { Categories: categorieList, total: totalList } =
        await response.json()

      setCategories(categorieList)
      setTotal(totalList)

      return categories
    },
  })
  const handleDelete = async (id) => {
    toast.loading(t("Delete.deletingCategory"))
    const response = await fetch(`/api/admin/business/categories/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setCategories((prevCategories) =>
        prevCategories.filter((categorie) => categorie._id !== id)
      )
      toast.dismiss()
      toast.success(t("Delete.categoryDeleted"))
    } else {
      toast.dismiss()
      toast.error(t("Delete.errorDeletingCategory"))
    }
  }
  const columns = [
    {
      id: "picture",
      header: t("Add.picture"),
      accessorKey: "picture",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Image
            src={row.getValue("picture")}
            alt="Category"
            className="rounded-xl object-cover"
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Add.label")} <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {getLocalizedValue(row.getValue("label"), locale)}
        </div>
      ),
    },
    {
      id: "description",
      header: t("Add.description"),
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="text-center">
          {trimString(
            getLocalizedValue(row.getValue("description"), locale),
            180
          )}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: t("isActive"),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("isActive") ? t("yes") : t("no")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditCategory(category)}>
                {t("More.editCategory")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(category._id)}
                className="text-red-700"
              >
                {t("More.deleteCategory")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const table = useReactTable({
    data: categories || [],
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
        <div className="ml-auto">
          <CategorieAdd setCategories={setCategories} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
                    <TableCell key={cell.id} className="text-center">
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
      <CategorieEdit
        setCategories={setCategories}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
      />
    </div>
  )
}
