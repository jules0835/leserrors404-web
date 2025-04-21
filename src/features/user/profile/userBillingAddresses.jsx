"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTitle } from "@/components/navigation/titleContext"
import DButton from "@/components/ui/DButton"

export default function UserBillingAddresses() {
  const t = useTranslations("User.Profile.BillingAddresses")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    zipCode: "",
    street: "",
  })
  const queryClient = useQueryClient()
  const { setTitle } = useTitle()
  setTitle(t("title"))

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["userBillingAddresses"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile/addresses")

      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }

      return response.json()
    },
  })
  const { mutate: addAddress, isPending: isAdding } = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/user/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to add address")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBillingAddresses"] })
      setIsDialogOpen(false)
      setFormData({
        name: "",
        country: "",
        city: "",
        zipCode: "",
        street: "",
      })
      toast.success(t("addressAdded"))
    },
    onError: () => {
      toast.error(t("addressAddError"))
    },
  })
  const { mutate: updateAddress, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/user/profile/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update address")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBillingAddresses"] })
      setIsDialogOpen(false)
      setEditingAddress(null)
      setFormData({
        name: "",
        country: "",
        city: "",
        zipCode: "",
        street: "",
      })
      toast.success(t("addressUpdated"))
    },
    onError: () => {
      toast.error(t("addressUpdateError"))
    },
  })
  const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/user/profile/addresses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete address")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBillingAddresses"] })
      toast.success(t("addressDeleted"))
    },
    onError: () => {
      toast.error(t("addressDeleteError"))
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingAddress) {
      updateAddress({ id: editingAddress._id, data: formData })
    } else {
      addAddress(formData)
    }
  }
  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      country: address.country,
      city: address.city,
      zipCode: address.zipCode,
      street: address.street,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAddress(null)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addAddress")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? t("editAddress") : t("addAddress")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("addressName")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t("city")}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">{t("zipCode")}</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">{t("street")}</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  required
                />
              </div>
              <DButton
                isDisabled={isAdding || isUpdating}
                isSubmit
                isLoading={isAdding || isUpdating}
              >
                {t("save")}
              </DButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          addresses?.map((address) => (
            <Card key={address._id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{address.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAddress(address._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p>{address.street}</p>
                <p>
                  {address.zipCode} {address.city}
                </p>
                <p>{address.country}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
