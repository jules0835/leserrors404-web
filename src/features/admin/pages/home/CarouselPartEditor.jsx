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

export default function CarouselPartEditor({ part, updatePart, locale }) {
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

  return (
    <div className="flex space-x-4 border border-gray-200 py-2 px-3 rounded-lg">
      <CarouselEditPartEditor
        open={open}
        setOpen={setOpen}
        part={part}
        updatePart={updatePart}
        locale={locale}
      />
      <Image
        src={part?.image || "/default_large.png"}
        alt="carousel"
        width={200}
        height={200}
        className="rounded-lg"
      />
      <div className="space-y-2 flex-grow">
        <h2>{t("Carousel.partTitle")}</h2>
        <p>
          {part?.titleTrans?.[locale]
            ? part?.titleTrans?.[locale]
            : t("Carousel.noTitle")}
        </p>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-2 flex-grow">
        <h2>{t("Carousel.partDescription")}</h2>
        <p>
          {part?.descriptionTrans?.[locale]
            ? part?.descriptionTrans?.[locale]
            : t("Carousel.noDescription")}
        </p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col items-center justify-center space-y-2">
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
        />
      </div>
    </div>
  )
}
