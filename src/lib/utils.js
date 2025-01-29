import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pagesNames, webAppSettings } from "@/assets/options/config"
import { findSalesfront } from "@/db/crud/salesfrontCrud"
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

export async function getHomeCarouselData() {
  const salesfront = await findSalesfront({
    name: webAppSettings.salesfront.homepage.carouselId,
    isActive: true,
  })

  if (salesfront) {
    salesfront.carouselParts = salesfront.carouselParts.filter(
      (part) => part.isActive
    )
  }

  return salesfront
}

export function trimString(string, length) {
  return string.length > length ? `${string.substring(0, length)}...` : string
}
