"use client"
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Link, useRouter } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import { useTitle } from "@/components/navigation/titleContext"
export default function Logout() {
  const router = useRouter()
  const t = useTranslations("Auth")
  const { setTitle } = useTitle()
  setTitle(t("titleLogout"))

  useEffect(() => {
    signOut({ redirect: false })
    router.push("/auth/login?logout=true")
  }, [router])

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
            {t("loggingYouOut")}
          </h1>
          <div className="dotsLoader mx-auto" />
          <p className="text-gray-500 text-sm text-center underline">
            <Link href="/auth/login">{t("loggingYouOutMessage")}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
