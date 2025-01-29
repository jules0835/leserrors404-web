// Doc : https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing

import { defineRouting } from "next-intl/routing"
import { createSharedPathnamesNavigation } from "next-intl/navigation"
import { webAppSettings } from "@/assets/options/config"

export const routing = defineRouting({
  locales: webAppSettings.translation.locales,
  defaultLocale: webAppSettings.translation.defaultLocale,
})

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
