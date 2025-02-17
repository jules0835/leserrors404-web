import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import CategorieAdd from "@/features/admin/business/categories/categorieAdd"

const ProductAdd = ({ setProducts }) => {
  const t = useTranslations("Admin.Business.Products.Add")
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    characteristics: "",
    categorie: "",
    stock: "",
    price: "",
    priority: "",
    image: null,
  })
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading(t("Add.addingProduct"))

    const data = new FormData()
    data.append("label", formData.label)
    data.append("description", formData.description)
    data.append("characteristics", formData.characteristics)
    data.append("categorie", formData.categorie)
    data.append("stock", formData.stock)
    data.append("price", formData.price)
    data.append("priority", formData.priority)

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
        label: "",
        description: "",
        characteristics: "",
        categorie: "",
        stock: "",
        price: "",
        priority: "",
        image: null,
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
        label: "",
        description: "",
        characteristics: "",
        categorie: "",
        stock: "",
        price: "",
        priority: "",
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

        <form onSubmit={handleProductSubmit} className="grid gap-4 py-4">
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
            <Label htmlFor="characteristics" className="text-right">
              {t("characteristics")}
            </Label>
            <Textarea
              id="characteristics"
              name="characteristics"
              value={formData.characteristics}
              className="col-span-3 min-h-[100px] border-2 rounded-md p-2"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categorie" className="text-right">
              {t("categorie")}
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
                  <SelectValue placeholder={t("selectCategorie")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CategorieAdd setCategories={setCategories} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              {t("stock")}
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
              {t("price")}
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
              {t("priority")}
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
