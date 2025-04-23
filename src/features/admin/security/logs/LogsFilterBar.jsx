"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { logKeys, logCriticalityKeys } from "@/assets/options/config"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LogsFilterBar({
  onFilterChange,
  onLogKeyChange,
  selectedLogKeys,
  selectedCriticalityKey,
  setSelectedLogKeys,
  setSelectedCriticalityKey,
}) {
  const t = useTranslations("Admin.Security.Logs")
  const [showFilters, setShowFilters] = React.useState(false)
  const handleLogKeyChange = (key) => {
    const newSelectedLogKeys = selectedLogKeys.includes(key)
      ? selectedLogKeys.filter((k) => k !== key)
      : [...selectedLogKeys, key]
    setSelectedLogKeys(newSelectedLogKeys)
    onLogKeyChange(newSelectedLogKeys)
  }
  const handleFilterClick = (key) => {
    const newSelectedCriticalityKey = selectedCriticalityKey === key ? "" : key
    setSelectedCriticalityKey(newSelectedCriticalityKey)
    onFilterChange(newSelectedCriticalityKey)
  }

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

      <div className={cn("w-full", !showFilters && "hidden md:block")}>
        <div className="md:hidden flex flex-col space-y-2">
          {Object.keys(logCriticalityKeys).map((key) => (
            <Button
              key={key}
              onClick={() => handleFilterClick(key)}
              className={`${
                selectedCriticalityKey === key
                  ? "bg-black text-white"
                  : "bg-white text-black hover:text-white"
              } w-full`}
            >
              {t(logCriticalityKeys[key].titleKey)}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {t("logKeys")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${
                Object.keys(logKeys).length > 8
                  ? "max-h-60 overflow-y-auto"
                  : ""
              }`}
            >
              {Object.keys(logKeys).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={selectedLogKeys.includes(key)}
                  onCheckedChange={() => handleLogKeyChange(key)}
                >
                  {t(logKeys[key].titleKey)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex flex-wrap items-center space-x-2">
          {Object.keys(logCriticalityKeys).map((key) => (
            <Button
              key={key}
              onClick={() => handleFilterClick(key)}
              className={`${
                selectedCriticalityKey === key
                  ? "bg-black text-white"
                  : "bg-white text-black hover:text-white"
              } flex-grow`}
            >
              {t(logCriticalityKeys[key].titleKey)}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex-grow">
                {t("logKeys")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${
                Object.keys(logKeys).length > 8
                  ? "max-h-60 overflow-y-auto"
                  : ""
              }`}
            >
              {Object.keys(logKeys).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={selectedLogKeys.includes(key)}
                  onCheckedChange={() => handleLogKeyChange(key)}
                >
                  {t(logKeys[key].titleKey)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
