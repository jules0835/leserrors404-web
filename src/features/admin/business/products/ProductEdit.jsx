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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { webAppSettings } from "@/assets/options/config"

const languages = Object.keys(webAppSettings.translation.titles)
const ProductEdit = ({ setProducts, editProduct, setEditProduct }) => {
  const t = useTranslations("Admin.Business.Products")
  const [formData, setFormData] = useState({
    label: { en: "" },
    description: { en: "" },
    characteristics: { en: "" },
    categorie: "",
    stock: "",
    price: "",
    priority: "",
    image: null,
    isActive: false,
    taxe: "",
    subscription: false,
  })
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    if (editProduct) {
      setFormData({
        label: JSON.parse(editProduct.label),
        description: JSON.parse(editProduct.description),
        characteristics: JSON.parse(editProduct.characteristics),
        categorie: editProduct.categorie,
        stock: editProduct.stock,
        price: editProduct.price,
        priority: editProduct.priority,
        image: null,
        isActive: editProduct.isActive,
        taxe: editProduct.taxe,
        subscription: editProduct.subscription,
      })
      setIsOpen(true)
    }
  }, [editProduct])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "/api/admin/business/categories?isActive=true"
      )
      const data = await response.json()
      setCategories(data.Categories)
    }
    fetchCategories()
  }, [])

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
  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("Edit.updating"))

    const data = new FormData()
    data.append("label", JSON.stringify(formData.label))
    data.append("description", JSON.stringify(formData.description))
    data.append("characteristics", JSON.stringify(formData.characteristics))
    data.append("categorie", formData.categorie)
    data.append("stock", formData.stock)
    data.append("price", formData.price)
    data.append("priority", formData.priority)
    data.append("isActive", formData.isActive)
    data.append("taxe", formData.taxe)
    data.append("subscription", formData.subscription)

    if (formData.image) {
      data.append("image", formData.image)
    }

    const response = await fetch(
      `/api/admin/business/products/${editProduct._id}`,
      {
        method: "PUT",
        body: data,
      }
    )

    if (response.ok) {
      const updatedProduct = await response.json()
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === updatedProduct.product._id
            ? updatedProduct.product
            : prod
        )
      )
      setIsOpen(false)
      setEditProduct(null)
      toast.dismiss()
      toast.success(t("Edit.updated"))
    } else {
      toast.dismiss()
      toast.error(t("Edit.errorUpdatingProduct"))
    }

    setIsLoading(false)
  }
  const handleOpenChange = (open) => {
    setIsOpen(open)

    if (!open) {
      setEditProduct(null)
    }
  }
  const isLanguageFilled = (lang) =>
    formData.label[lang] &&
    formData.description[lang] &&
    formData.characteristics[lang]

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
            <Label htmlFor="characteristics" className="text-right">
              {t("Add.characteristics")}
            </Label>
            <Textarea
              id="characteristics"
              name="characteristics"
              value={formData.characteristics[selectedLanguage] || ""}
              className="col-span-3 min-h-[100px]"
              onChange={handleTranslationChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categorie" className="text-right">
              {t("Add.categorie")}
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categorie: value }))
                }
                required
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t("Add.selectCategorie")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              {t("Add.stock")}
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              className="col-span-3"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              {t("Add.price")}
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              className="col-span-3"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              {t("Add.priority")}
            </Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
              required
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("Add.selectPriority")} />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3].map((priority) => (
                  <SelectItem key={priority} value={priority.toString()}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              {t("Add.isActive")}
            </Label>
            <Switch
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleSwitchChange("isActive", checked)
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxe" className="text-right">
              {t("Add.taxe")}
            </Label>
            <Input
              id="taxe"
              name="taxe"
              type="number"
              value={formData.taxe}
              className="col-span-3"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription" className="text-right">
              {t("Add.subscription")}
            </Label>
            <Switch
              id="subscription"
              name="subscription"
              checked={formData.subscription}
              onCheckedChange={(checked) =>
                handleSwitchChange("subscription", checked)
              }
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

export default ProductEdit
