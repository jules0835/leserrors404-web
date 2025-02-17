"use client"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import ProductAdd from "@/features/admin/business/products/productAdd"
import ProductEdit from "@/features/admin/business/products/ProductEdit"
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
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { trimString } from "@/lib/utils"

export default function ProductsList() {
  const t = useTranslations("Admin.Business.Products")
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({
    label: true,
    description: true,
    characteristics: true,
    categorie: true,
    stock: true,
    price: true,
    priority: true,
    isActive: true,
    picture: true,
  })
  const [rowSelection, setRowSelection] = useState([])
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [editProduct, setEditProduct] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "/api/admin/business/categories?isActive=true"
      )
      const data = await response.json()
      setCategories(data.Categories)
    }
    fetchCategories()
  }, [])

  const { isLoading, error } = useQuery({
    queryKey: ["products", page, limit, query],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/business/products?limit=${limit}&page=${page}&query=${query}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const { Products: productList, total: totalList } = await response.json()

      setProducts(productList)
      setTotal(totalList)

      return products
    },
  })
  const handleDelete = async (id) => {
    toast.loading(t("Delete.deletingProduct"))
    const response = await fetch(`/api/admin/business/products/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      )
      toast.dismiss()
      toast.success(t("Delete.productDeleted"))
    } else {
      toast.dismiss()
      toast.error(t("Delete.errorDeletingProduct"))
    }
  }
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId)

    return category ? category.label : ""
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
            alt="Product"
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
        <div className="text-center">{row.getValue("label")}</div>
      ),
    },
    {
      id: "description",
      header: t("Add.description"),
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="text-center">
          {trimString(row.getValue("description"), 180)}
        </div>
      ),
    },
    {
      accessorKey: "characteristics",
      header: t("Add.characteristics"),
      cell: ({ row }) => (
        <div className="text-center">
          {trimString(row.getValue("characteristics"), 180)}
        </div>
      ),
    },
    {
      accessorKey: "categorie",
      header: t("Add.categorie"),
      cell: ({ row }) => (
        <div className="text-center">
          {getCategoryName(row.getValue("categorie"))}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: t("Add.stock"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("stock")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: t("Add.price"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: t("Add.priority"),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("priority")}</div>
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
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditProduct(product)}>
                {t("More.editProduct")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(product._id)}
                className="text-red-700"
              >
                {t("More.deleteProduct")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const table = useReactTable({
    data: products || [],
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
            <Button variant="outline" className="ml-2">
              {t("columns")} <ArrowUpDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
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
                  {t(`Add.${column.id}`)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto">
          <ProductAdd setProducts={setProducts} />
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
      <ProductEdit
        setProducts={setProducts}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      />
    </div>
  )
}
