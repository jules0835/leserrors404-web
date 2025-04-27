"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { Languages } from "lucide-react"

export default function LocaleSwitcher({ white }) {
  const [newPath, setNewPath] = useState("")
  const actualLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setNewPath(pathname.replace(`/${actualLocale}`, ""))
  }, [actualLocale, pathname])

  const locales = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Languages
          className={`text-${white ? "white" : "black"} text-3xl hover:scale-110 mt-1`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => router.push(`/${locale.code}${newPath}`)}
            className={locale.code === actualLocale ? "font-bold" : ""}
          >
            {locale.code === actualLocale ? locale.name : locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
