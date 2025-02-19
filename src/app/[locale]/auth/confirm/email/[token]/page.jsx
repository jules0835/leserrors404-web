import { webAppSettings } from "@/assets/options/config"
import { Button } from "@/components/ui/button"
import { confirmEmailWithToken } from "@/features/auth/utils/accountService"
import { Link } from "@/i18n/routing"
import { MailCheck, MailWarning } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function Page({ params }) {
  const t = await getTranslations("Auth")
  const { token } = await params
  const confirmResult = await confirmEmailWithToken(token)

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <Link
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        href="/"
      >
        <div className="p-4 rounded-2xl">
          <Image
            src={webAppSettings.images.logoUrl}
            alt="logo"
            width={132}
            height={132}
          />
        </div>
      </Link>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div></div>
        <div className="flex items-center justify-center py-4 text-2xl font-bold">
          {t("confirmEmail")}
        </div>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
          {confirmResult && (
            <div className="flex flex-col items-center">
              <MailCheck size={48} color="#01b939" />
              <h1 className=" mt-7">{t("confirmEmailSuccess")}</h1>
              <Link href="/auth/login" className="mt-6">
                <Button>{t("login")}</Button>
              </Link>
            </div>
          )}
          {!confirmResult && (
            <div className="flex flex-col items-center">
              <MailWarning size={48} color="#FF0000" />
              <h1 className=" mt-7">{t("confirmEmailFailed")}</h1>
              <Link href="/auth/login" className="mt-6">
                <Button>{t("login")}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
