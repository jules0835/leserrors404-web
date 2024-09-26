// Doc : https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing

import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  return {
    messages: (await import(`../assets/messages/${locale}.json`)).default,
  }
})
