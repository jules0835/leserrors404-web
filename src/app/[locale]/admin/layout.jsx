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

export default function AdminLayout({ children }) {
  const t = useTranslations("")
  const pathname = usePathname()
  const isAdminInbox = pathname.includes("/admin/support/inbox")
  const isHomeAdmin = pathname.endsWith("/admin")

  return (
    <div className="flex flex-col">
      <SidebarProvider>
        <AdminSideNavbar />
        <SidebarInset className="flex flex-col flex-1">
          <AdminTopNavbar />
          <div
            className={isAdminInbox ? "flex-1 overflow-hidden" : "min-h-screen"}
          >
            <div className={`${isAdminInbox ? "" : "mx-7 my-2"}`}>
              {!isAdminInbox && !isHomeAdmin && (
                <div>
                  <h1 className="text-2xl font-semibold">
                    {t(returnPageTitleTranslation(pathname))}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t(returnPageSubTitleTranslation(pathname))}
                  </p>
                </div>
              )}
              <div
                className={`${isAdminInbox ? "h-[calc(100vh-56px)]" : "mt-5"}`}
              >
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
