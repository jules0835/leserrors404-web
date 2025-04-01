"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import { company, webAppSettings } from "@/assets/options/config"
import { Link } from "@/i18n/routing"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations("Auth")
  const searchParams = useSearchParams()
  const reval = searchParams.get("reval")
  const reloadCounter = searchParams.get("reloadCounter") || 0

  useEffect(() => {
    if (reval) {
      const params = new URLSearchParams(searchParams)
      params.delete("reval")
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.location.replace(newUrl)

      return
    }

    if (status === "loading") {
      return
    }

    if (status === "unauthenticated") {
      if (reloadCounter > 3) {
        const params = new URLSearchParams(searchParams)
        router.push(`/auth/login?${params.toString()}`)

        return
      }

      const params = new URLSearchParams(searchParams)
      const newReloadCounter = parseInt(reloadCounter, 10) + 1
      params.set("reloadCounter", newReloadCounter)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.location.replace(newUrl)

      return
    }

    const redirectUrl = `${webAppSettings.urls.mobileCallbackLogin}${session.user.tokenMobile}`

    window.location.href = redirectUrl
  }, [session, status, router, searchParams, reval, reloadCounter])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        <div className="p-4 rounded-2xl">
          <Image src={logo} alt="logo" width={132} height={132} />
        </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            {t("redirectingToMobile", { company: company.name })}
          </h1>
          <div className="dotsLoader mx-auto" />
          {session?.user?.tokenMobile && (
            <p className="text-gray-500 text-sm text-center">
              <Link
                href={`${webAppSettings.urls.mobileCallbackLogin}${session.user.tokenMobile}`}
                className="underline"
              >
                {t("clickToOpenMobileApp")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
