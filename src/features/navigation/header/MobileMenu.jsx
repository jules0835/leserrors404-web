import { Link } from "@/i18n/routing"
import { useTranslations } from "use-intl"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MobileMenu() {
  const t = useTranslations("header")
  const tFooter = useTranslations("footer")
  const { openChat } = useChat()

  return (
    <div className="md:hidden mt-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="text-white hover:scale-110 transition-all"
            aria-label="Menu"
          >
            <Menu />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/shop/products">{t("products")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/company">{t("aboutUs")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/legals/terms-and-conditions">
              {tFooter("termsOfUse")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/legals">{tFooter("legalNotice")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openChat}>
            {tFooter("contact")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
