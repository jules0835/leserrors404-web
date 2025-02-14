"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSideNavbar from "@/features/admin/layout/AdminSideNavbar"
import AdminTopNavbar from "@/features/admin/layout/AdminTopNavbar"
import { useTranslations } from "next-intl"
import {
  returnPageTitleTranslation,
  returnPageSubTitleTranslation,
} from "@/lib/utils"
import { usePathname } from "next/navigation"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function AdminLayout({ children }) {
  const t = useTranslations("")
  const pathname = usePathname()

  return (
    <QueryClientProvider client={new QueryClient()}>
      <SidebarProvider>
        <AdminSideNavbar />
        <SidebarInset>
          <AdminTopNavbar />
          <div className="mx-7 my-2">
            <div>
              <h1 className="text-2xl font-semibold">
                {t(returnPageTitleTranslation(pathname))}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t(returnPageSubTitleTranslation(pathname))}
              </p>
            </div>
            <div className="mt-5">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}
