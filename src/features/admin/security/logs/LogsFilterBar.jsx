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
import { ChevronDown } from "lucide-react"

export default function LogsFilterBar({
  onFilterChange,
  onLogKeyChange,
  selectedLogKeys,
  selectedCriticalityKey,
  setSelectedLogKeys,
  setSelectedCriticalityKey,
}) {
  const t = useTranslations("Admin.Security.Logs")
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
    <div className="flex flex-wrap items-center space-x-2 w-full">
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
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`${
            Object.keys(logKeys).length > 8 ? "max-h-60 overflow-y-auto" : ""
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
  )
}
