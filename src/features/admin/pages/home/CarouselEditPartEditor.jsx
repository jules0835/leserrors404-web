/* eslint-disable max-lines-per-function */
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
import { useState } from "react"

export default function CarouselEditPartEditor({
  open,
  setOpen,
  part,
  updatePart,
}) {
  const t = useTranslations("Admin.SalesFront.HomePage")
  const [localPart, setLocalPart] = useState(part)
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
    updatePart(localPart)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Carousel.editPartTitle")}</DialogTitle>
          <DialogDescription>
            {t("Carousel.editPartDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {Object.entries(webAppSettings.translation.titles).map(
            ([lang, label]) => (
              <div key={lang} className="space-y-2">
                <h3 className="text-lg font-semibold">{label}</h3>
                <div>
                  <label htmlFor={`title-${lang}`} className="block text-sm">
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
                  />
                </div>
                <div>
                  <label
                    htmlFor={`description-${lang}`}
                    className="block text-sm"
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
                  />
                </div>
              </div>
            )
          )}
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
              onChange={(e) => handleFieldChange("image", e.target.files[0])}
              placeholder={t("Carousel.imagePlaceholder")}
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
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Carousel.cancelButton")}
          </Button>
          <Button onClick={handleSave}>{t("Carousel.saveButton")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
