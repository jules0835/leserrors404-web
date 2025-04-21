"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import ErrorFront from "@/components/navigation/error"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import {
  getMessageTypeColor,
  getMessageTypeText,
  getLatestTickets,
} from "@/features/admin/dashboard/service/statsFrontService"
import { formatIdForDisplay } from "@/lib/utils"

export default function AdminDashboardTickets() {
  const t = useTranslations("Admin.Support.Tickets")
  const router = useRouter()
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardLatestTickets"],
    queryFn: getLatestTickets,
  })

  if (error) {
    return <ErrorFront />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("latestTickets")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("ticketId")}</TableHead>
                <TableHead>{t("user")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("lastMessageType")}</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-1 w-full space-y-7">
                    <DataGridSkeleton rows={1} cells={4} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.tickets?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                data?.tickets?.map((ticket) => {
                  const messageType = getLastMessageType(ticket)

                  return (
                    <TableRow key={ticket._id}>
                      <TableCell>#{formatIdForDisplay(ticket)}</TableCell>
                      <TableCell>
                        {ticket.user
                          ? `${ticket.user.firstName} ${ticket.user.lastName}`
                          : ticket.userName || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            ticket.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {ticket.isActive ? t("open") : t("closed")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {messageType && (
                          <Badge
                            variant="outline"
                            className={getMessageTypeColor(messageType)}
                          >
                            {getMessageTypeText(messageType, t)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/support/inbox/${ticket._id}`)
                          }
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
