"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import LanguageIcon from "@mui/icons-material/Language"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"

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
    { code: "de", name: "Deutsch" },
    { code: "ts", name: "TEST LANGUAGE" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <LanguageIcon
          className={`text-${white ? "white" : "black"} text-3xl`}
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
