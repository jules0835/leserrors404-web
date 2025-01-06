"use client"

import DropdownMenu from "@/components/ui/DropdownMenu"
import LanguageIcon from "@mui/icons-material/Language"

export default function LocaleSwitcher() {
  const locales = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "cn", name: "中文" },
    { code: "it", name: "Italiano" },
    { code: "ts", name: "TEST LANGUAGE" },
  ]

  return (
    <div>
      <DropdownMenu
        icon={<LanguageIcon className=" text-white " />}
        noChevron
        options={locales.map((locale) => ({
          action: () => {
            window.location.href = `/${
              locale.code
            }${window.location.pathname.slice(3)}`
          },
          label: locale.name,
          href: false,
          login: false,
        }))}
      />
    </div>
  )
}
