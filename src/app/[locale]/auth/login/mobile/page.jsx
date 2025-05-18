"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import { company, webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { Shield, Smartphone } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useTitle } from "@/components/navigation/titleContext"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations("Auth")
  const searchParams = useSearchParams()
  const reval = searchParams.get("reval")
  const reloadCounter = searchParams.get("reloadCounter") || 0
  const { setTitle } = useTitle()
  setTitle(t("titleMobile"))

  useEffect(() => {
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

    if (!session?.user?.tokenMobile) {
      const params = new URLSearchParams(searchParams)
      params.set("error", "mobile_token_missing")
      router.push(`/auth/login?${params.toString()}`)

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
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-12 mx-4">
            <div className="flex flex-col items-center justify-center font-semibold">
              <Shield className="w-10 h-10 md:w-12 md:h-12" />
              <p>{company.name}</p>
            </div>
            <div className="dotsLoader mx-auto" />
            <div className="flex flex-col items-center justify-center font-semibold">
              <Smartphone className="w-10 h-10 md:w-12 md:h-12" />
              <p>{t("application")}</p>
            </div>
          </div>
          <Separator className="w-full mt-4" />
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            {t("redirectingToMobile", { company: company.name })}
          </h1>
          <p className="text-gray-500 text-sm text-center">
            {t("redirectingToMobileMessage")}
          </p>
          <div>
            <DButton
              onClickBtn={() => {
                window.location.href = `${webAppSettings.urls.mobileCallbackLogin}${session.user.tokenMobile}`
              }}
              isMain
              isDisabled={!session?.user?.tokenMobile}
            >
              {t("clickToOpenMobileApp")}
            </DButton>
          </div>
        </div>
      </div>
    </div>
  )
}
