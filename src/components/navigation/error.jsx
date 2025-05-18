import { webAppSettings } from "@/assets/options/config"
import Image from "next/image"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { Undo2 } from "lucide-react"

export default function ErrorFront() {
  const t = useTranslations("Error.Front")

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mt-4">
        {t("errorFrontTitle")}
      </h1>
      <Image
        src={webAppSettings.images.errorUrl}
        alt="error"
        width={400}
        height={400}
        className="mt-4"
      />
      <DButton isMain withLink={"/"}>
        <Undo2 className="mr-4" />
        {t("backHome")}
      </DButton>
    </div>
  )
}
