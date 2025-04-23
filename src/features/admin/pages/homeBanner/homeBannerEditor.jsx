"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Info, AlertTriangle, Tag } from "lucide-react"
import { webAppSettings } from "@/assets/options/config"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import ListSkeleton from "@/components/skeleton/ListSkeleton"

const styleOptions = [
  { value: "info", label: "Information", icon: Info },
  { value: "promo", label: "Promotion", icon: Tag },
  { value: "warning", label: "Avertissement", icon: AlertTriangle },
  { value: "error", label: "Erreur", icon: AlertCircle },
]

export default function HomeBannerEditor() {
  const t = useTranslations("Admin.SalesFront.HomePage.Banner")
  const [formData, setFormData] = useState({
    isActive: false,
    style: "info",
    titleTrans: {},
    descriptionTrans: {},
  })
  const { data: bannerData, isLoading } = useQuery({
    queryKey: ["banner"],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/salesfront/pages/home?name=${webAppSettings.salesfront.homepage.alertBannerId}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch banner")
      }

      const data = await response.json()

      if (data?.alertBanner) {
        setFormData({
          isActive: data.alertBanner.isActive || false,
          style: data.alertBanner.style || "info",
          titleTrans: data.alertBanner.titleTrans || {},
          descriptionTrans: data.alertBanner.descriptionTrans || {},
        })
      }

      return data
    },
  })
  const handleInputChange = (field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }))
  }
  const saveBanner = async (updatedData) => {
    const response = await fetch(
      `/api/admin/salesfront/pages/home?name=${webAppSettings.salesfront.homepage.alertBannerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to update banner")
    }

    return response.json()
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedData = {
      ...bannerData,
      alertBanner: formData,
    }

    toast.promise(saveBanner(updatedData), {
      loading: t("saving"),
      success: t("saved"),
      error: t("error"),
    })
  }

  if (isLoading) {
    return <ListSkeleton rows={5} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          {t("active")}
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("style")}</label>
        <Select
          value={formData.style}
          onValueChange={(value) => setFormData({ ...formData, style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((option) => {
              const Icon = option.icon

              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
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
                    {t("title")} ({label})
                  </label>
                  <Input
                    id={`title-${lang}`}
                    type="text"
                    value={formData.titleTrans?.[lang] || ""}
                    onChange={(e) =>
                      handleInputChange("titleTrans", lang, e.target.value)
                    }
                    placeholder={t("titlePlaceholder")}
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`description-${lang}`}
                    className="block text-sm mb-2"
                  >
                    {t("description")} ({label})
                  </label>
                  <Textarea
                    id={`description-${lang}`}
                    value={formData.descriptionTrans?.[lang] || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "descriptionTrans",
                        lang,
                        e.target.value
                      )
                    }
                    placeholder={t("descriptionPlaceholder")}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <Button type="submit" className="w-full">
        {t("save")}
      </Button>
    </form>
  )
}
