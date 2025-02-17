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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

const CategorieAdd = ({ setCategories = null }) => {
  const t = useTranslations("Admin.Business.Categories.Add")
  const [formData, setFormData] = useState({
    label: "",
    description: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("Add.addingCategory"))

    const data = new FormData()
    data.append("label", formData.label)
    data.append("description", formData.description)

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
        label: "",
        description: "",
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
        label: "",
        description: "",
        image: null,
      })
    }
  }

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
            <Label htmlFor="label" className="text-right">
              {t("label")}
            </Label>
            <Input
              id="label"
              name="label"
              value={formData.label}
              className="col-span-3"
              onChange={handleChange}
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
              value={formData.description}
              className="col-span-3 min-h-[100px] border-2 rounded-md p-2"
              onChange={handleChange}
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
