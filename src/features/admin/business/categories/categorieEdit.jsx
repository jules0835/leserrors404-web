import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea"

const languages = Object.keys(webAppSettings.translation.titles)
const CategorieEdit = ({ setCategories, editCategory, setEditCategory }) => {
  const t = useTranslations("Admin.Business.Categories")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [formData, setFormData] = useState({
    label: { en: "" },
    description: { en: "" },
    image: null,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isLanguageFilled = (lang) =>
    formData.label[lang] && formData.description[lang]

  useEffect(() => {
    if (editCategory) {
      setFormData({
        label:
          typeof editCategory.label === "string"
            ? JSON.parse(editCategory.label)
            : editCategory.label,
        description:
          typeof editCategory.description === "string"
            ? JSON.parse(editCategory.description)
            : editCategory.description,
        isActive: editCategory.isActive,
        image: null,
      })
      setIsOpen(true)
    }
  }, [editCategory])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        // eslint-disable-next-line no-nested-ternary
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
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
  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("Edit.updating"))

    const data = new FormData()
    data.append("label", JSON.stringify(formData.label))
    data.append("description", JSON.stringify(formData.description))
    data.append("isActive", formData.isActive)

    if (formData.image) {
      data.append("image", formData.image)
    }

    const response = await fetch(
      `/api/admin/business/categories/${editCategory._id}`,
      {
        method: "PUT",
        body: data,
      }
    )

    if (response.ok) {
      const updatedCategory = await response.json()
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === updatedCategory.categorie._id
            ? updatedCategory.categorie
            : cat
        )
      )
      setIsOpen(false)
      setEditCategory(null)
      toast.dismiss()
      toast.success(t("Edit.updated"))
    } else {
      toast.dismiss()
      toast.error(t("Edit.errorUpdatingCategory"))
    }

    setIsLoading(false)
  }
  const handleOpenChange = (open) => {
    setIsOpen(open)

    if (!open) {
      setEditCategory(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Edit.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("Edit.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              {t("Edit.language")}
            </Label>
            <Select
              id="language"
              name="language"
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              className="col-span-3"
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Edit.selectLanguage")} />
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
              {t("Add.label")}
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
              {t("Add.description")}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description[selectedLanguage] || ""}
              className="col-span-3 min-h-[100px]"
              onChange={handleTranslationChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              {t("Add.isActive")}
            </Label>
            <Switch
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image-upload" className="text-right">
              {t("Add.picture")}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("Edit.updating") : t("Edit.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategorieEdit
