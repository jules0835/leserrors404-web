"use client"

import { useEffect } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import NavLink from "@/features/navigation/header/NavLink"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import NavSearchBar from "@/features/navigation/header/NavSearchBar"
import { mergeCarts } from "@/features/shop/cart/utils/cartService"
import { useTranslations } from "use-intl"

export default function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const reval = searchParams.get("reval")
  const router = useRouter()
  const t = useTranslations("header")

  useEffect(() => {
    async function fetchData() {
      if (reval) {
        await mergeCarts()
        const params = new URLSearchParams(searchParams)
        params.delete("reval")
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.location.replace(newUrl)
      }
    }
    fetchData()
  }, [reval, searchParams, router])

  if (
    pathname.includes("/auth/") ||
    pathname.includes("/admin") ||
    pathname.includes("/shop/checkout/redirect")
  ) {
    return null
  }

  return (
    <header className="bg-[#2F1F80] p-3 md:fixed top-0 w-full z-50">
      <div className="max-w-[calc(100%-4px)] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center relative">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <Image src={logo} alt="logo" width={130} height={130} />
            </Link>
          </div>
          <NavSearchBar />
          <div className="flex items-center gap-8 w-full md:w-auto">
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/shop/products"
                className="text-white hover:underline transition-colors font-medium"
              >
                {t("products")}
              </Link>
              <Link
                href="/company"
                className="text-white hover:underline transition-colors font-medium"
              >
                {t("aboutUs")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center md:mt-0 mt-5">
            <NavLink />
          </div>
        </div>
      </div>
    </header>
  )
}
