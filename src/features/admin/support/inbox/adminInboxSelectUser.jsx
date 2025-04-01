"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, User, Building2, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { useDebounce } from "@uidotdev/usehooks"

export default function AdminInboxSelectUser({
  returnUser,
  isOpen,
  setIsOpen,
  title,
}) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const limit = 5
  const t = useTranslations("Admin.Chat")
  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", debouncedQuery, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/security/users?limit=${limit}&page=${page}&query=${debouncedQuery}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      return response.json()
    },
    enabled: debouncedQuery.length > 0,
  })
  const handleClose = () => {
    setQuery("")
    setPage(1)
    setIsOpen(false)
  }
  const handleUserSelect = (user) => {
    returnUser(user)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || t("selectUser")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("searchUser")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>

        <div className="min-h-[200px] transition-all duration-200 ease-in-out">
          {isLoading && (
            <div className="mt-2">
              <ListSkeleton rows={3} height={10} />
            </div>
          )}

          {error && (
            <div className="mt-2 text-sm text-red-500">
              {t("errorLoadingUsers")}
            </div>
          )}

          {data?.users?.length > 0 && (
            <div className="space-y-2 mt-4">
              {data.users.map((user) => (
                <Button
                  key={user._id}
                  variant="outline"
                  className="w-full justify-start gap-2 h-16 px-2 py-6 transition-all duration-200 hover:bg-accent"
                  onClick={() => handleUserSelect(user)}
                >
                  <User className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {user.firstName} {user.lastName} -{" "}
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span>{user.company}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {data?.users?.length === 0 && debouncedQuery && (
            <div className="mt-2 text-sm text-muted-foreground">
              {t("noUsersFound")}
            </div>
          )}
        </div>

        {data?.total > limit && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="transition-all duration-200"
            >
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= data.total}
              className="transition-all duration-200"
            >
              {t("next")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
