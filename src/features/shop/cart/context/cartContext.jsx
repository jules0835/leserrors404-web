"use client"
import {
  addProductToCart,
  applyVoucher,
  getCartItemsCount,
  removeProductFromCart,
  updateProductQuantity,
  removeVoucher,
  updateBillingCycle,
  updateCartBillingAddress,
  getCart,
} from "@/features/shop/cart/utils/cartService"
import { createContext, useContext, useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    updateCartCount()
  }, [])

  const updateCartCount = async () => {
    const count = await getCartItemsCount()
    setCartCount(count)
  }
  const addProdToCart = async (
    productId,
    quantity = 1,
    billingCycle = undefined
  ) => {
    const result = await addProductToCart(productId, quantity, billingCycle)

    if (result) {
      updateCartCount()
    }
  }
  const removeProdFromCart = async (productId) => {
    const result = await removeProductFromCart(productId)

    if (result) {
      updateCartCount()
    }
  }
  const updateProdCart = async (
    productId,
    quantity,
    billingCycle = undefined
  ) => {
    const result = await updateProductQuantity(
      productId,
      quantity,
      billingCycle
    )

    if (result) {
      updateCartCount()
    }
  }
  const applyCartVoucher = async (voucherCode) => {
    try {
      const result = await applyVoucher(voucherCode)

      if (result) {
        updateCartCount()
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  const removeCartVoucher = async () => {
    try {
      const result = await removeVoucher()

      if (result) {
        updateCartCount()
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  const updateProdBillingCycle = async (productId, billingCycle) => {
    const result = await updateBillingCycle(productId, billingCycle)

    if (result) {
      updateCartCount()
    }
  }
  const updateBillingAddress = async (address) => {
    try {
      setIsUpdating(true)
      const cart = await getCart()

      if (!cart) {
        return false
      }

      const result = await updateCartBillingAddress(cart._id, address)

      if (result) {
        await queryClient.invalidateQueries({ queryKey: ["cart"] })
        await queryClient.refetchQueries({ queryKey: ["cart"] })
        updateCartCount()
      }

      return result
    } catch (error) {
      toast.error(error.message)
      throw new Error(error.message)
    } finally {
      setIsUpdating(false)
    }
  }
  const addNewAddress = async (address) => {
    try {
      setIsUpdating(true)
      const response = await fetch("/api/user/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      })

      if (!response.ok) {
        throw new Error("Failed to add address")
      }

      const addedAddress = await response.json()
      await updateBillingAddress(addedAddress[addedAddress.length - 1])
      await queryClient.invalidateQueries({
        queryKey: ["userBillingAddresses"],
      })
      await queryClient.refetchQueries({ queryKey: ["userBillingAddresses"] })

      return addedAddress
    } catch (error) {
      toast.error(error.message)
      throw new Error(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        addProdToCart,
        updateCartCount,
        removeProdFromCart,
        updateProdCart,
        applyCartVoucher,
        removeCartVoucher,
        updateProdBillingCycle,
        updateBillingAddress,
        addNewAddress,
        isUpdating,
        setIsUpdating,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
