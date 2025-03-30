/* eslint-disable require-unicode-regexp */
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pagesNames, webAppSettings, logKeys } from "@/assets/options/config"
import { findSalesfront } from "@/db/crud/salesfrontCrud"
import log from "@/lib/log"
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function returnPageTitleTranslation(pathname) {
  const path = `/${pathname.split("/").slice(2).join("/")}`
  const pageTitle = pagesNames.find((page) => {
    const regex = new RegExp(`^${page.url.replace(/\[Id\]/gi, "[^/]+")}$`, "i")

    return regex.test(path)
  })

  return pageTitle?.titleKey ?? "DefaultNotFound"
}

export function returnPageSubTitleTranslation(pathname) {
  const path = `/${pathname.split("/").slice(2).join("/")}`
  const pageSubTitle = pagesNames.find((page) => {
    const regex = new RegExp(`^${page.url.replace(/\[Id\]/giu, "[^/]+")}$`, "i")

    return regex.test(path)
  })

  return pageSubTitle?.subTitleKey ?? ""
}

export async function getHomeCarouselData() {
  try {
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
  } catch (error) {
    log.systemError({
      logKey: logKeys.settingsEdit.key,
      message: "Failed to get home carousel data",
      technicalMessage: error.message,
      isError: true,
    })
  }

  return null
}

export function trimString(string, length) {
  if (string === null || string === undefined) {
    return string
  }

  return string.length > length ? `${string.substring(0, length)}...` : string
}
