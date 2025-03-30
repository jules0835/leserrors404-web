"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/features/navigation/header/UserNav"
import LocaleSwitcher from "@/features/navigation/header/LocaleSwitcher"
import { useRouter } from "@/i18n/routing"
import { Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminTopNavbar() {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Button onClick={() => router.back()} variant="ghost" size="icon">
            <Undo2 size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 ml-auto" id="right">
          <div className="hidden md:flex">ICI RECHERCHEs ?</div>
          <div>ICI NOTIFICATIONS ?</div>
          <LocaleSwitcher />
          <UserNav />
        </div>
      </header>
    </div>
  )
}
