"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { usePathname } from "@/i18n/routing"
import { useDocumentTitle } from "@uidotdev/usehooks"
import { company } from "@/assets/options/config"
import { useTranslations } from "use-intl"

const TitleContext = createContext()

export function TitleProvider({ children }) {
  const t = useTranslations("pageTitle")
  const defaultPageName = `${company.name} | ${t("default")}`
  const pathname = usePathname()
  const lastRoute = useRef(pathname)
  const isAdmin = usePathname().includes("/admin")
  const [pageTitle, setPageTitle] = useState(defaultPageName)
  const [pageCount, setPageCount] = useState(0)
  const [hasCustomTitle, setHasCustomTitle] = useState(false)
  const fullTitle = pageCount > 0 ? `(${pageCount}) ${pageTitle}` : pageTitle

  useDocumentTitle(fullTitle)

  useEffect(() => {
    if (pathname !== lastRoute.current) {
      lastRoute.current = pathname

      if (!hasCustomTitle) {
        const pathSegments = pathname.split("/").filter(Boolean)
        const lastSegment =
          pathSegments[pathSegments.length - 1] || t("default")
        const formattedTitle =
          lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
        t("default")
        setPageTitle(
          `${formattedTitle} | ${company.name} ${isAdmin ? t("admin") : ""}`
        )

        if (pageCount === 0) {
          setPageCount(0)
        }
      }

      setHasCustomTitle(false)
    }
  }, [pathname, hasCustomTitle, pageCount, isAdmin, t])

  const setTitle = (title) => {
    if (title !== undefined) {
      setPageTitle(`${title} | ${company.name} ${isAdmin ? t("admin") : ""}`)
      setHasCustomTitle(true)
    }
  }
  const setCount = (count) => {
    if (count !== undefined) {
      setPageCount(count)
    }
  }
  const resetTitle = () => {
    setPageTitle(defaultPageName)
    setPageCount(0)
    setHasCustomTitle(false)
  }

  return (
    <TitleContext.Provider value={{ setTitle, setCount, resetTitle }}>
      {children}
    </TitleContext.Provider>
  )
}

export const useTitle = () => useContext(TitleContext)
