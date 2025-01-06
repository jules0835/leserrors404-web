// Doc : https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing

import { defineRouting } from "next-intl/routing"
import { createSharedPathnamesNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  locales: ["en", "de", "ts", "fr", "cn", "es", "it"],

  defaultLocale: "en",
})

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
