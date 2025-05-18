/* eslint-disable max-lines-per-function */
"use client"
import { ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/routing"
import { userNavItems } from "@/assets/options/config"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UserSidebar() {
  const { firstName, lastName } = useSession()?.data?.user || {}
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("Navigation")

  return (
    <Sidebar className="mt-16">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-7" asChild>
              <Link
                href="/user/dashboard"
                className="p-2 rounded-md w-full flex items-center hover:bg-gray-100"
              >
                <Avatar className="h-11 w-11 border border-purple-900">
                  <AvatarFallback>
                    {firstName?.charAt(0)}
                    {lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="px-2">
                  <h1 className="font-bold text-lg">{t("myAccount")}</h1>
                  {firstName && lastName && (
                    <span className="text-xs">{`${firstName} ${lastName}`}</span>
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            {userNavItems.map((item) => {
              const Icon = item.icon

              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === `/${locale}${item.url}`}
                      >
                        {item.icon && <Icon />}
                        <span>{t(item.translationKey)}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === `/${locale}${subItem.url}`}
                            >
                              <Link href={subItem.url}>
                                <span>{t(subItem.translationKey)}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === `/${locale}${item.url}`}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{t(item.translationKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
