"use client"
import {
  addProductToCart,
  getCartItemsCount,
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
  const addProdToCart = async (productId, quantity = 1) => {
    const result = await addProductToCart(productId, quantity)

    if (result) {
      updateCartCount()
    }
  }

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, addProdToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
