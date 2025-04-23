"use client"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import UserSidebar from "@/features/user/layout/userSidebar"
import { usePathname } from "next/navigation"
import {
  returnPageSubTitleTranslation,
  returnPageTitleTranslation,
} from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function UserLayout({ children }) {
  const pathname = usePathname()
  const t = useTranslations("")
  const isUserInbox = pathname.includes("/user/dashboard/support/tickets")

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <div
          className={
            isUserInbox
              ? "flex-1 overflow-hidden mt-2 md:mt-16"
              : "mx-7 my-2 md:mt-16"
          }
        >
          {!isUserInbox && (
            <div className="md:mt-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <SidebarTrigger className="-ml-1" />
                </div>
                <h1 className="text-2xl font-semibold">
                  {t(returnPageTitleTranslation(pathname))}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(returnPageSubTitleTranslation(pathname))}
              </p>
            </div>
          )}
          <div className={isUserInbox ? "h-[calc(100vh-65px)]" : "mt-5"}>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
