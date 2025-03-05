"use client"

import { useEffect } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import NavLink from "@/features/navigation/header/NavLink"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import NavSearchBar from "@/features/navigation/header/NavSearchBar"

export default function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const reval = searchParams.get("reval")
  const router = useRouter()
  const isUserDashboard = pathname.includes("/user/dashboard")

  useEffect(() => {
    if (reval) {
      const params = new URLSearchParams(searchParams)
      params.delete("reval")
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.location.replace(newUrl)
    }
  }, [reval, searchParams, router])

  if (pathname.includes("/auth/") || pathname.includes("/admin")) {
    return null
  }

  return (
    <header
      className={`bg-[#2F1F80] p-3 ${isUserDashboard ? "fixed top-0 w-full z-50" : ""}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center relative">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <Image src={logo} alt="logo" width={130} height={130} />
          </Link>
        </div>

        <NavSearchBar />

        <div className="flex items-center space-x-10">
          <NavLink />
        </div>
      </div>
    </header>
  )
}
