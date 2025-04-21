"use client"
import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { Landmark, Shield, Smartphone, Store } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { company, webAppSettings } from "@/assets/options/config"
import { fetchCheckoutOrder } from "@/features/shop/checkout/utils/userCheckout"
import { useTitle } from "@/components/navigation/titleContext"

export default function RedirectCheckout() {
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const router = useRouter()
  const t = useTranslations("Shop.Checkout")
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const isMobileApp = searchParams.get("appMobileCheckout") === "true"
  const isMobileFailed = searchParams.get("isMobileFailed") === "true"
  const { setTitle } = useTitle()
  setTitle(t("title"))
  const { data } = useQuery({
    queryKey: ["checkoutOrder", sessionId],
    queryFn: () => fetchCheckoutOrder(sessionId),
    enabled: Boolean(sessionId),
    retry: false,
    refetchInterval: (dataRefetch) => {
      if (dataRefetch?.isSessionReady && !isMobileApp) {
        router.push(`/shop/checkout/success/${dataRefetch.orderId}`)
      } else if (dataRefetch?.isSessionReady && isMobileApp) {
        window.location.href = `${webAppSettings.urls.successCheckoutMobileRedirect}&orderId=${dataRefetch.orderId}`
      }

      return 5000
    },
  })

  useEffect(() => {
    if (isMobileFailed && isMobileApp) {
      window.location.href = `${webAppSettings.urls.cancelCheckoutMobileRedirect}`
    }
  }, [isMobileFailed, isMobileApp])

  useEffect(() => {
    if (!sessionId && !isMobileApp) {
      router.push("/shop/cart")
    } else if (!sessionId && isMobileApp && !isMobileFailed) {
      window.location.href = webAppSettings.urls.failedCheckoutMobileRedirect
    }

    const timer = setTimeout(() => {
      setIsErrorMessage(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [router, sessionId, isMobileApp, isMobileFailed])

  useEffect(() => {
    if (!data) {
      return
    }

    if (data?.isSessionReady && !isMobileApp) {
      router.push(`/shop/checkout/success/${data.orderId}`)
    } else if (data?.isSessionReady && isMobileApp) {
      window.location.href = `${webAppSettings.urls.successCheckoutMobileRedirect}&orderId=${data.orderId}`
    } else if (!data?.isSessionExist && !isMobileApp) {
      router.push("/shop/cart")
    } else if (!data?.isSessionExist && isMobileApp) {
      window.location.href = webAppSettings.urls.failedCheckoutMobileRedirect
    }
  }, [data, router, isMobileApp])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 bg-[#2F1F80]">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        <div className="p-4 rounded-2xl">
          <Image src={logo} alt="logo" width={132} height={132} />
        </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          {isMobileFailed ? (
            <div className="flex flex-col items-center">
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

              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mt-2">
                {t("transactionFailed")}
              </h1>
              <p className="text-gray-500 text-sm text-center mt-4">
                {t("transactionFailedMessage")}
              </p>
              <DButton
                isMain
                className="mt-4"
                onClickBtn={() => {
                  window.location.href = `${webAppSettings.urls.cancelCheckoutMobileRedirect}`
                }}
              >
                {t("returnToApp")}
              </DButton>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-12 md:gap-16">
                <div className="flex flex-col items-center justify-center font-semibold">
                  <Landmark className="w-10 h-10 md:w-12 md:h-12" />
                  <p>{t("yourPayment")}</p>
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

              {isErrorMessage && (
                <div>
                  <p className="text-gray-500 text-sm text-center">
                    {t("redirectingToCheckoutMessage")}
                  </p>
                  <DButton
                    isMain
                    withLink={
                      isMobileApp
                        ? webAppSettings.urls.failedCheckoutMobileRedirect
                        : "/"
                    }
                  >
                    {t("myOrders")}
                  </DButton>
                </div>
              )}
              {!isErrorMessage && !isMobileApp && (
                <div>
                  <p className="text-gray-500 text-sm text-center">
                    {t("redirectingMessage")}
                  </p>
                </div>
              )}
              {!isErrorMessage && isMobileApp && (
                <p className="text-gray-500 text-sm text-center mt-4">
                  {t("redirectingToCheckoutMessageMobile", {
                    company: company.name,
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
