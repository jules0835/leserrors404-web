/* eslint-disable max-lines-per-function */
"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { webAppSettings } from "@/assets/options/config"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"

export default function CarouselEditPartEditor({
  open,
  setOpen,
  part,
  updatePart,
}) {
  const t = useTranslations("Admin.SalesFront.HomePage")
  const [localPart, setLocalPart] = useState(part)
  const [imageBase64, setImageBase64] = useState("")

  useEffect(() => {
    if (localPart.image && typeof localPart.image !== "string") {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result.split(",")[1])
      }
      reader.readAsDataURL(localPart.image)
    }
  }, [localPart.image])

  const handleInputChange = (field, lang, value) => {
    setLocalPart((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }))
  }
  const handleFieldChange = (field, value) => {
    setLocalPart((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const handleSave = () => {
    const updatedPart = { ...localPart }

    if (imageBase64) {
      updatedPart.uploadImage = imageBase64
    }

    updatePart(updatedPart)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("Carousel.editPartTitle")}</DialogTitle>
          <DialogDescription>
            {t("Carousel.editPartDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto max-h-[70vh] p-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {t("Carousel.imageUpload")}
              </h3>
              <label htmlFor="image-upload" className="block text-sm">
                {t("Carousel.imageLabel")}
              </label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFieldChange("image", e.target.files[0])}
                placeholder={t("Carousel.imagePlaceholder")}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("Carousel.link")}</h3>
              <label htmlFor="link-input" className="block text-sm">
                {t("Carousel.linkLabel")}
              </label>
              <Input
                id="link-input"
                type="url"
                value={localPart.link || ""}
                onChange={(e) => handleFieldChange("link", e.target.value)}
                placeholder={t("Carousel.linkPlaceholder")}
                className="w-full"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-6">
            {Object.entries(webAppSettings.translation.titles).map(
              ([lang, label]) => (
                <div key={lang} className="space-y-4">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`title-${lang}`}
                        className="block text-sm mb-2"
                      >
                        {t("Carousel.title")} ({label})
                      </label>
                      <Input
                        id={`title-${lang}`}
                        type="text"
                        value={localPart.titleTrans?.[lang] || ""}
                        onChange={(e) =>
                          handleInputChange("titleTrans", lang, e.target.value)
                        }
                        placeholder={t("Carousel.titlePlaceholder")}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`description-${lang}`}
                        className="block text-sm mb-2"
                      >
                        {t("Carousel.description")} ({label})
                      </label>
                      <Input
                        id={`description-${lang}`}
                        type="text"
                        value={localPart.descriptionTrans?.[lang] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "descriptionTrans",
                            lang,
                            e.target.value
                          )
                        }
                        placeholder={t("Carousel.descriptionPlaceholder")}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            {t("Carousel.cancelButton")}
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            {t("Carousel.saveButton")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
