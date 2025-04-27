import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/features/shop/cart/context/cartContext"
import toast from "react-hot-toast"
import DButton from "@/components/ui/DButton"

export default function CartCheckoutAddresses({ cart, session, isLoading }) {
  const t = useTranslations("Shop.Cart")
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    name: "",
    country: "",
    city: "",
    zipCode: "",
    street: "",
  })
  const { updateBillingAddress, addNewAddress, isUpdating } = useCart()
  const queryClient = useQueryClient()
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["userBillingAddresses"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile/addresses")

      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }

      return response.json()
    },
    enabled: Boolean(session),
  })
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId) => {
      const response = await fetch(`/api/user/profile/addresses/${addressId}`, {
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
      setIsDeleteDialogOpen(false)
      setAddressToDelete(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const handleAddressSelect = async (address) => {
    try {
      await updateBillingAddress(address)
      setSelectedAddress(address)
      setIsAddressDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleAddNewAddress = async (e) => {
    e.preventDefault()

    try {
      await addNewAddress(newAddress)
      setNewAddress({
        name: "",
        country: "",
        city: "",
        zipCode: "",
        street: "",
      })
      toast.success("Address added successfully")
      setIsAddressDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleDeleteAddress = (address) => {
    setAddressToDelete(address)
    setIsDeleteDialogOpen(true)
  }
  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete._id)
    }
  }
  const renderAddressContent = () => {
    if (isUpdating || isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )
    }

    if (cart?.billingAddress) {
      return (
        <div className="space-y-1 text-center md:text-left">
          <p className="font-medium">{cart.billingAddress.name}</p>
          <p>{cart.billingAddress.street}</p>
          <p>
            {cart.billingAddress.zipCode} {cart.billingAddress.city}
          </p>
          <p>{cart.billingAddress.country}</p>
        </div>
      )
    }

    return (
      <p className="text-muted-foreground text-center md:text-left">
        {t("noBillingAddress")}
      </p>
    )
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-2 gap-2">
        <h3 className="font-semibold text-center md:text-left">
          {t("billingAddress")}
        </h3>
        <Dialog
          open={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full md:w-auto">
              <Edit2 className="h-4 w-4 mr-2" />
              {t("changeAddress")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-center md:text-left">
                {t("selectBillingAddress")}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 pr-2">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {isLoadingAddresses ? (
                    <>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </>
                  ) : (
                    addresses?.map((address) => (
                      <Card
                        key={address._id}
                        className={`p-4 cursor-pointer ${
                          selectedAddress?._id === address._id
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div
                            className="space-y-1 text-center md:text-left flex-1 cursor-pointer"
                            onClick={() => handleAddressSelect(address)}
                          >
                            <h4 className="font-semibold">{address.name}</h4>
                            <p>{address.street}</p>
                            <p>
                              {address.zipCode} {address.city}
                            </p>
                            <p>{address.country}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteAddress(address)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
                <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                  <h4 className="font-semibold mb-4 text-center md:text-left">
                    {t("addNewAddress")}
                  </h4>
                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("addressName")}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newAddress.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t("country")}</Label>
                      <Input
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("city")}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">{t("zipCode")}</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street">{t("addressStreet")}</Label>
                      <Input
                        id="street"
                        name="street"
                        value={newAddress.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <DButton
                      isLoading={isUpdating}
                      isSubmit
                      isMain
                      className="w-full"
                    >
                      {t("addAddress")}
                    </DButton>
                  </form>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {renderAddressContent()}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteAddress")}</DialogTitle>
            <DialogDescription>
              {t("deleteAddressConfirmation")}
            </DialogDescription>
          </DialogHeader>
          {addressToDelete && (
            <div className="space-y-1 py-2">
              <p className="font-medium">{addressToDelete.name}</p>
              <p>{addressToDelete.street}</p>
              <p>
                {addressToDelete.zipCode} {addressToDelete.city}
              </p>
              <p>{addressToDelete.country}</p>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAddress}
              className="w-full sm:w-auto"
              disabled={deleteAddressMutation.isPending}
            >
              {deleteAddressMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
