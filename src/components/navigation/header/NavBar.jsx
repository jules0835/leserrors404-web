import NaviLink from "@/components/header/naviLink"
import { useTranslations, useLocale } from "next-intl"

export default function NavBar() {
  const t = useTranslations("NavLinks")
  const locale = useLocale()
  const links = [
    {
      name: t("home"),
      href: "",
    },
    {
      name: t("search"),
      href: "/locations",
    },
  ]

  return (
    <>
      {links.map((link) => (
        <NaviLink
          key={link.href}
          name={link.name}
          href={`/${locale}${link.href}`}
        />
      ))}
    </>
  )
}
