/* eslint-disable max-lines-per-function */
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
    characteristics: { en: [] },
    categorie: "",
    stock: "",
    price: "",
    priceMonthly: "",
    priceAnnual: "",
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
        label: editProduct.label,
        description: editProduct.description,
        characteristics: editProduct.characteristics,
        categorie: editProduct.categorie,
        stock: editProduct.stock,
        price: editProduct.price,
        priceMonthly: editProduct.priceMonthly,
        priceAnnual: editProduct.priceAnnual,
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
    data.append("categorie", JSON.stringify(formData.categorie))
    data.append("stock", JSON.stringify(formData.stock))
    data.append("price", JSON.stringify(formData.price))
    data.append("priceMonthly", JSON.stringify(formData.priceMonthly))
    data.append("priceAnnual", JSON.stringify(formData.priceAnnual))
    data.append("priority", JSON.stringify(formData.priority))
    data.append("isActive", JSON.stringify(formData.isActive))
    data.append("taxe", JSON.stringify(formData.taxe))
    data.append("subscription", JSON.stringify(formData.subscription))

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
    formData.characteristics[lang] &&
    formData.characteristics[lang].length > 0
  const handleAddCharacteristic = () => {
    const newCharacteristic = document.getElementById("newCharacteristic").value

    if (newCharacteristic.trim()) {
      setFormData((prev) => ({
        ...prev,
        characteristics: {
          ...prev.characteristics,
          [selectedLanguage]: [
            ...(prev.characteristics[selectedLanguage] || []),
            newCharacteristic.trim(),
          ],
        },
      }))
      document.getElementById("newCharacteristic").value = ""
    }
  }
  const handleRemoveCharacteristic = (index) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [selectedLanguage]: prev.characteristics[selectedLanguage].filter(
          (_, i) => i !== index
        ),
      },
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("Edit.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("Edit.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="language">{t("Edit.language")}</Label>
                <Select
                  id="language"
                  name="language"
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
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
                          isLanguageFilled(lang)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="label">{t("Add.label")}</Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label[selectedLanguage] || ""}
                  onChange={handleTranslationChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">{t("Add.description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description[selectedLanguage] || ""}
                  className="min-h-[100px] border-2 rounded-md p-2"
                  onChange={handleTranslationChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="characteristics">
                  {t("Add.characteristics")}
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="newCharacteristic"
                      placeholder={t("Add.addCharacteristic")}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddCharacteristic}>
                      {t("Add.add")}
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto border rounded-md p-2">
                    {(formData.characteristics[selectedLanguage] || []).map(
                      (char, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 border rounded-md p-2"
                        >
                          <span className="flex-1">{char}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveCharacteristic(index)}
                          >
                            {t("Add.remove")}
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="categorie">{t("Add.categorie")}</Label>
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
                        {category.label[selectedLanguage] || category.label.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="stock">{t("Add.stock")}</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              {!formData.subscription && (
                <div className="space-y-1 flex justify-between">
                  <div>
                    <Label htmlFor="price">{t("Add.price")}</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="subscription">
                      {t("Add.subscription")}
                    </Label>
                    <Switch
                      id="subscription"
                      name="subscription"
                      checked={formData.subscription}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("subscription", checked)
                      }
                    />
                  </div>
                </div>
              )}
              {formData.subscription && (
                <>
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="priceMonthly">
                        {t("Add.priceMonthly")}
                      </Label>
                      <Input
                        id="priceMonthly"
                        name="priceMonthly"
                        type="number"
                        value={formData.priceMonthly}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Label htmlFor="subscription">
                        {t("Add.subscription")}
                      </Label>
                      <Switch
                        id="subscription"
                        name="subscription"
                        checked={formData.subscription}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("subscription", checked)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="priceAnnual">{t("Add.priceAnnual")}</Label>
                    <Input
                      id="priceAnnual"
                      name="priceAnnual"
                      type="number"
                      value={formData.priceAnnual}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div className="space-y-1">
                <Label htmlFor="priority">{t("Add.priority")}</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                  required
                >
                  <SelectTrigger>
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
              <div className="space-y-1">
                <Label htmlFor="taxe">{t("Add.taxe")}</Label>
                <Input
                  id="taxe"
                  name="taxe"
                  type="number"
                  value={formData.taxe}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image-upload">{t("Add.picture")}</Label>
                <Input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-2 space-y-1 border rounded-md p-2">
              <Label htmlFor="isActive">{t("Add.isActive")}</Label>
              <div>
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isActive", checked)
                  }
                />
              </div>
            </div>
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
