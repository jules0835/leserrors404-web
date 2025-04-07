"use client"
import {
  addProductToCart,
  applyVoucher,
  getCartItemsCount,
  removeProductFromCart,
  updateProductQuantity,
  removeVoucher,
} from "@/features/shop/cart/utils/cartService"
import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)

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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
