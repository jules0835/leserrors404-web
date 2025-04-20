import { webAppSettings } from "@/assets/options/config"
import DButton from "@/components/ui/DButton"
import { checkResetToken } from "@/db/crud/userCrud"
import ResetPassword from "@/features/auth/resetPassword"
import { Link } from "@/i18n/routing"
import { ShieldX } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { useTitle } from "@/components/navigation/titleContext"

export default async function Page({ params }) {
  const t = await getTranslations("Auth.ResetPasswordPage")
  const { token } = await params
  const isValidToken = await checkResetToken(token)
  const { setTitle } = useTitle()
  setTitle(t("title"))

  if (!isValidToken) {
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
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <ShieldX size={48} color="red" />
            <h1 className="text-2xl font-semibold text-center">
              {t("invalidToken")}
            </h1>
            <p className="text-sm text-center">{t("invalidTokenMessage")}</p>
            <div className="flex justify-center space-x-4">
              <DButton isMain={true} withLink="/auth/password">
                {t("backToResetPassword")}
              </DButton>
              <DButton withLink="/">{t("backToHome")}</DButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        <ResetPassword token={token} />
      </div>
    </div>
  )
}
