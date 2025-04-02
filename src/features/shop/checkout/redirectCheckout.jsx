"use client"
import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { Landmark, Store } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { company } from "@/assets/options/config"

export default function RedirectCheckout() {
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const router = useRouter()
  const t = useTranslations("Shop.Checkout")
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const fetchCheckoutOrder = async () => {
    const response = await fetch(`/api/shop/checkout/redirect/${sessionId}`)

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return response.json()
  }
  const { data } = useQuery({
    queryKey: ["checkoutOrder", sessionId],
    queryFn: fetchCheckoutOrder,
    enabled: Boolean(sessionId),
    retry: false,
    refetchInterval: (dataRefetch) => {
      if (dataRefetch?.isSessionReady) {
        router.push(`/shop/checkout/success/${dataRefetch.orderId}`)
      }

      return 5000
    },
  })

  useEffect(() => {
    if (!sessionId) {
      router.push("/shop/cart")
    }

    const timer = setTimeout(() => {
      setIsErrorMessage(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [router, sessionId])

  useEffect(() => {
    if (!data) {
      return
    }

    if (data?.isSessionReady) {
      router.push(`/shop/checkout/success/${data.orderId}`)
    } else if (!data?.isSessionExist) {
      router.push("/shop/cart")
    }
  }, [data, router])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 bg-[#2F1F80]">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        <div className="p-4 rounded-2xl">
          <Image src={logo} alt="logo" width={132} height={132} />
        </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex flex-col items-center ">
            <div className="flex items-center gap-12 md:gap-16">
              <div className="flex flex-col items-center justify-center font-semibold">
                <Landmark className="w-10 h-10  md:w-12 md:h-12" />
                <p>{t("yourBank")}</p>
              </div>
              <div className="dotsLoader mx-auto" />
              <div className="flex flex-col items-center justify-center font-semibold">
                <Store className="w-10 h-10 md:w-12 md:h-12" />
                <p>{company.name}</p>
              </div>
            </div>
            <Separator className="w-full mt-4" />
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mt-4">
              {t("redirectingToCheckout")}
            </h1>
          </div>
          {isErrorMessage && (
            <div>
              <p className="text-gray-500 text-sm text-center">
                {t("redirectingToCheckoutMessage")}
              </p>
              <DButton isMain withLink="/">
                {t("myOrders")}
              </DButton>
            </div>
          )}
          {!isErrorMessage && (
            <div>
              <p className="text-gray-500 text-sm text-center">
                {t("redirectingMessage")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
