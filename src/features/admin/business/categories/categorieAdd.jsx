import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { webAppSettings } from "@/assets/options/config"

const languages = Object.keys(webAppSettings.translation.titles)
const CategorieAdd = ({ setCategories = null }) => {
  const t = useTranslations("Admin.Business.Categories.Add")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [formData, setFormData] = useState({
    label: { en: "" },
    description: { en: "" },
    image: null,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }))
  }
  const handleTranslationChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [selectedLanguage]: value,
      },
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("addingCategory"))

    const data = new FormData()
    data.append("label", JSON.stringify(formData.label))
    data.append("description", JSON.stringify(formData.description))

    if (formData.image) {
      data.append("image", formData.image)
    }

    const response = await fetch("/api/admin/business/categories", {
      method: "POST",
      body: data,
    })

    if (response.ok) {
      const newCategory = await response.json()

      if (setCategories) {
        setCategories((prev) => [newCategory.categorie, ...prev])
      }

      setFormData({
        label: { en: "" },
        description: { en: "" },
        image: null,
      })
      setIsOpen(false)
      toast.dismiss()
      toast.success(t("categoryAdded"))
    } else {
      toast.dismiss()
      toast.error(t("errorAddingCategory"))
    }

    setIsLoading(false)
  }
  const handleOpenChange = (open) => {
    setIsOpen(open)

    if (!open) {
      setFormData({
        label: { en: "" },
        description: { en: "" },
        image: null,
      })
    }
  }
  const isLanguageFilled = (lang) =>
    formData.label[lang] && formData.description[lang]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-5">
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              {t("language")}
            </Label>
            <Select
              id="language"
              name="language"
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              className="col-span-3"
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className={
                      isLanguageFilled(lang) ? "text-green-500" : "text-red-500"
                    }
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              {t("label")}
            </Label>
            <Input
              id="label"
              name="label"
              value={formData.label[selectedLanguage] || ""}
              className="col-span-3"
              onChange={handleTranslationChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("description")}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description[selectedLanguage] || ""}
              className="col-span-3 min-h-[100px] border-2 rounded-md p-2"
              onChange={handleTranslationChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image-upload" className="text-right">
              {t("picture")}
            </Label>
            <Input
              id="image-upload"
              name="image"
              className="col-span-3"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t("adding") : t("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategorieAdd
