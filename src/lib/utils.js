import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pagesNames } from "@/assets/options/config"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function returnPageTitleTranslation(pathname) {
  const path = `/${pathname.split("/").slice(2).join("/")}`
  const pageTitle = pagesNames.find((page) => page.url === path)

  return pageTitle?.titleKey ?? "DefaultNotFound"
}

export function returnPageSubTitleTranslation(pathname) {
  const path = `/${pathname.split("/").slice(2).join("/")}`
  const pageSubTitle = pagesNames.find((page) => page.url === path)

  return pageSubTitle?.subTitleKey ?? "NoSubTitle"
}
