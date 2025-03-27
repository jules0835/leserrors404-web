"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Search, SquareX, Calendar as CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const subscriptionStatuses = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past Due" },
  { value: "canceled", label: "Canceled" },
  { value: "unpaid", label: "Unpaid" },
  { value: "incomplete", label: "Incomplete" },
  { value: "incomplete_expired", label: "Incomplete Expired" },
]

export default function AdminSubscriptionsFilterBar({
  status,
  onStatusChange,
  search,
  handleSearch,
  date,
  setDate,
  handleResetClick,
}) {
  const t = useTranslations("Admin.Business.Subscriptions")

  return (
    <div>
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <div className="relative w-1/2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={handleSearch}
              className="pl-8 w-full"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={handleResetClick}>
            <SquareX className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center space-x-2 w-full mt-4">
        {subscriptionStatuses.map((subscriptionStatus) => (
          <Button
            key={subscriptionStatus.value}
            onClick={() => onStatusChange(subscriptionStatus.value)}
            className={`${
              status === subscriptionStatus.value
                ? "bg-black text-white"
                : "bg-white text-black hover:text-white"
            } flex-grow`}
          >
            {t(`Status.${subscriptionStatus.value}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
