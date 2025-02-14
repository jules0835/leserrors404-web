/* eslint-disable max-lines-per-function */
"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { webAppSettings } from "@/assets/options/config"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function UserNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations("Navigation")

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-purple-900">
              <AvatarImage
                src={session.user?.image}
                alt={session.user?.firstName ?? ""}
              />
              <AvatarFallback>
                {session.user?.firstName?.charAt(0)}
                {session.user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.firstName} {session.user?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          {(session?.user?.isAdmin || session?.user?.isSuperAdmin) && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t("admin")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(webAppSettings.urls.adminDashboard)}
                className="ml-3"
              >
                {t("dashboard")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("account")}</DropdownMenuLabel>
            <DropdownMenuItem className="ml-3">{t("profile")}</DropdownMenuItem>
            <DropdownMenuItem className="ml-3">{t("billing")}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border border-purple-900">
            <AvatarImage src={"/user_default.png"} alt={"No user"} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(webAppSettings.urls.login)}
          >
            {t("login")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(webAppSettings.urls.register)}
          >
            {t("register")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
