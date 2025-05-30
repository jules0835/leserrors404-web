/* eslint-disable max-lines-per-function */
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import CategorieAdd from "@/features/admin/business/categories/categorieAdd"
import { webAppSettings } from "@/assets/options/config"

const languages = Object.keys(webAppSettings.translation.titles)
const ProductAdd = ({ setProducts }) => {
  const t = useTranslations("Admin.Business.Products.Add")
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
    taxe: "",
    subscription: false,
  })
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

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

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        "/api/admin/business/categories?isActive=true"
      )
      const data = await response.json()
      setCategories(data.Categories)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("addingProduct"))

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
    data.append("taxe", JSON.stringify(formData.taxe))
    data.append("subscription", JSON.stringify(formData.subscription))

    if (formData.image) {
      data.append("image", formData.image)
    }

    const response = await fetch("/api/admin/business/products", {
      method: "POST",
      body: data,
    })

    if (response.ok) {
      const newProduct = await response.json()
      setProducts((prev) => [newProduct.product, ...prev])
      setFormData({
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
        taxe: "",
        subscription: false,
      })
      setIsOpen(false)
      toast.dismiss()
      toast.success(t("productAdded"))
    } else {
      toast.dismiss()
      toast.error(t("errorAddingProduct"))
    }

    setIsLoading(false)
  }
  const handleOpenChange = (open) => {
    setIsOpen(open)

    if (!open) {
      setFormData({
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
        taxe: "",
        subscription: false,
      })
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
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-5">
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleProductSubmit} className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="language">{t("language")}</Label>
                <Select
                  id="language"
                  name="language"
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
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
                <Label htmlFor="label">{t("label")}</Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label[selectedLanguage] || ""}
                  onChange={handleTranslationChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">{t("description")}</Label>
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
                <Label htmlFor="characteristics">{t("characteristics")}</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="newCharacteristic"
                      placeholder={t("addCharacteristic")}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddCharacteristic}>
                      {t("add")}
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
                            {t("remove")}
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
                <Label htmlFor="categorie">{t("categorie")}</Label>
                <div className="flex items-center gap-2">
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
                      <SelectValue placeholder={t("selectCategorie")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.label.selectedLanguage || category.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CategorieAdd setCategories={setCategories} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="stock">{t("stock")}</Label>
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
                    <Label htmlFor="price">{t("price")}</Label>
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
                    <Label htmlFor="subscription">{t("subscription")}</Label>
                    <div>
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
                </div>
              )}

              {formData.subscription && (
                <>
                  <div className="space-y-1 flex justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="priceMonthly">{t("priceMonthly")}</Label>
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
                      <Label htmlFor="subscription">{t("subscription")}</Label>
                      <div>
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
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="priceAnnual">{t("priceAnnual")}</Label>
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
                <Label htmlFor="priority">{t("priority")}</Label>
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
                    <SelectValue placeholder={t("selectPriority")} />
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
                <Label htmlFor="taxe">{t("taxe")}</Label>
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
                <Label htmlFor="image-upload">{t("picture")}</Label>
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
          <DialogFooter className="mt-6">
            <Button onClick={handleProductSubmit} disabled={isLoading}>
              {isLoading ? t("adding") : t("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductAdd
