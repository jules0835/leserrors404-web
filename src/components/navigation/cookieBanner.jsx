"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const t = useTranslations("cookieBanner")

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent")

    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 180)
    localStorage.setItem("cookieConsent", expirationDate.toISOString())
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2F1F80] text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          {t("message")}{" "}
          <Link href="/legals" className="underline">
            {t("privacyPolicy")}
          </Link>
          .
        </div>
        <Button
          onClick={handleAccept}
          className="bg-white text-[#2F1F80] hover:bg-white/90"
        >
          {t("accept")}
        </Button>
      </div>
    </div>
  )
}
