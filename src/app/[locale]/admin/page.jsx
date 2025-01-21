import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function Home() {
  const t = useTranslations("HomeAdmin")

  return (
    <div>
      <h1>{t("title")}</h1>
      <Link href="/about">{t("about")}</Link>
    </div>
  )
}
