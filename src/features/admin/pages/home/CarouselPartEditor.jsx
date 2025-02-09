/* eslint-disable max-lines-per-function */
/* eslint-disable no-empty-function */
/* eslint-disable no-underscore-dangle */
"use client"
import Image from "next/image"
import SettingsToolbar from "@/features/settings/SettingsToolbar"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import CarouselEditPartEditor from "@/features/admin/pages/home/CarouselEditPartEditor"
import { useState } from "react"
import { webAppSettings } from "@/assets/options/config"
import { trimString } from "@/lib/utils"

export default function CarouselPartEditor({
  part,
  updatePart,
  locale,
  updatePartPosition,
}) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("Admin.SalesFront.HomePage")
  const deletePart = () => {
    updatePart({
      ...part,
      isDeleted: true,
    })
  }
  const updatePartStatus = () => {
    updatePart({
      ...part,
      isActive: !part?.isActive,
    })
  }
  const totalLanguages = Object.keys(webAppSettings.translation.titles).length
  const completedTranslations = Object.values(part?.titleTrans || {}).filter(
    (title) => title && title.trim() !== ""
  ).length

  return (
    <div className="flex border border-gray-200 py-2 px-3 rounded-lg">
      <CarouselEditPartEditor
        open={open}
        setOpen={setOpen}
        part={part}
        updatePart={updatePart}
        locale={locale}
      />
      <div className="flex-1 relative w-24 h-24">
        <Image
          src={part?.image || "/default_large.png"}
          alt="carousel"
          className="rounded-xl object-cover"
          fill
        />
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="flex-1 space-y-2 text-center">
        <h2 className="font-semibold">{t("Carousel.partTitle")}</h2>
        <p>
          {part?.titleTrans?.[locale]
            ? trimString(part?.titleTrans?.[locale], 50)
            : t("Carousel.noTitle")}
        </p>
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="flex-1 space-y-2 text-center">
        <h2 className="font-semibold">{t("Carousel.partDescription")}</h2>
        <p>
          {part?.descriptionTrans?.[locale]
            ? trimString(part?.descriptionTrans?.[locale], 50)
            : t("Carousel.noDescription")}
        </p>
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="flex-1 space-y-2 text-center">
        <h2 className="font-semibold">{t("Carousel.partUrl")}</h2>
        <p>{part?.link ? trimString(part?.link, 20) : t("Carousel.noUrl")}</p>
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="flex-1 space-y-2 text-center">
        <h2 className="font-semibold">{t("Carousel.partTranslationDone")}</h2>
        <p>
          {`${completedTranslations}/${totalLanguages}`}{" "}
          {t("Carousel.partTranslationAreDone")}
        </p>
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="flex flex-col items-center justify-center space-y-2 flex-1 text-center">
        <span
          className={`${
            part?.isActive ? "text-green-500" : "text-orange-500"
          } font-semibold`}
        >
          {part?.isActive ? t("Carousel.active") : t("Carousel.inactive")}
        </span>
        <SettingsToolbar
          deleteAction={deletePart}
          editAction={() => {
            setOpen(true)
          }}
          isActive={part?.isActive}
          activationAction={updatePartStatus}
          desactivationAction={updatePartStatus}
          positionUpAction={() => updatePartPosition("up", part)}
          positionDownAction={() => updatePartPosition("down", part)}
        />
      </div>
    </div>
  )
}
