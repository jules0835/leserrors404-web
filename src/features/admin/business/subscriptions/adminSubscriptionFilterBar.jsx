"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import {
  Search,
  SquareX,
  Calendar as CalendarIcon,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
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
  const [showFilters, setShowFilters] = React.useState(false)

  return (
    <div>
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {t("filters")}
          </span>
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div
        className={cn("flex items-center", !showFilters && "hidden md:flex")}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
          <div className="relative w-full md:w-1/2">
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
                  "w-full md:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
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
          <Button
            variant="outline"
            onClick={handleResetClick}
            className="w-full md:w-auto"
          >
            <SquareX className="mr-2 h-4 w-4" />
            {t("resetFilters")}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "items-center space-y-2 md:space-y-0 md:space-x-2 w-full mt-4",
          !showFilters && "hidden md:flex"
        )}
      >
        {subscriptionStatuses.map((subscriptionStatus) => (
          <Button
            key={subscriptionStatus.value}
            onClick={() => onStatusChange(subscriptionStatus.value)}
            className={`${
              status === subscriptionStatus.value
                ? "bg-black text-white"
                : "bg-white text-black hover:text-white"
            } w-full md:flex-grow mb-2 md:mb-0`}
          >
            {t(`Status.${subscriptionStatus.value}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
