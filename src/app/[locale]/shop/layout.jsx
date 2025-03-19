"use client"
import { usePathname } from "@/i18n/routing"

export default function UserLayout({ children }) {
  const pathname = usePathname()

  if (pathname.includes("/shop/checkout/redirect")) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen mx-7 md:mt-14 pb-10 mt-40">
      <div className="pt-4">{children}</div>
    </div>
  )
}
