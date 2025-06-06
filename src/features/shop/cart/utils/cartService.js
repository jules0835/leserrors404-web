export const getCartItemsCount = async () => {
  const cart = await getCart()

  return cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0
}

export const getLocalCartId = () => localStorage.getItem("tempCartId")

export const initializeCart = async () => {
  try {
    const response = await fetch("/api/shop/cart", {
      method: "POST",
    })

    if (!response.ok) {
      return false
    }

    return await response.json()
  } catch {
    return false
  }
}

export const addProductToCart = async (
  productId,
  quantity = 1,
  billingCycle = undefined
) => {
  try {
    let cart = await getCart()

    cart ||= await initializeCart()

    if (!cart) {
      return false
    }

    const params = new URLSearchParams({
      action: "add",
      productId,
      quantity: quantity.toString(),
    })

    if (billingCycle) {
      params.append("billingCycle", billingCycle)
    }

    const response = await fetch(
      `/api/shop/cart/${cart._id}?${params.toString()}`
    )

    return response.ok
  } catch {
    return false
  }
}

export const removeProductFromCart = async (productId) => {
  try {
    const cart = await getCart()

    if (!cart) {
      return false
    }

    const response = await fetch(
      `/api/shop/cart/${cart._id}?action=remove&productId=${productId}`
    )

    return response.ok
  } catch {
    return false
  }
}

export const updateProductQuantity = async (
  productId,
  quantity,
  billingCycle = undefined
) => {
  try {
    const cart = await getCart()

    if (!cart) {
      return false
    }

    const params = new URLSearchParams({
      action: "update",
      productId,
      quantity: quantity.toString(),
    })

    if (billingCycle) {
      params.append("billingCycle", billingCycle)
    }

    const response = await fetch(
      `/api/shop/cart/${cart._id}?${params.toString()}`
    )

    return response.ok
  } catch {
    return false
  }
}

export const clearCart = async () => {
  try {
    const cart = await getCart()

    if (!cart) {
      return false
    }

    const response = await fetch(`/api/shop/cart/${cart._id}?action=clear`)

    return response.ok
  } catch {
    return false
  }
}

export const getCart = async () => {
  try {
    const response = await fetch("/api/shop/cart")

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    if (data.code === "CART_NOT_FOUND") {
      return null
    }

    return data
  } catch {
    return false
  }
}

export const mergeCarts = async () => {
  try {
    const response = await fetch("/api/shop/cart", {
      method: "PUT",
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    return data
  } catch {
    return false
  }
}

export const applyVoucher = async (code) => {
  const cart = await getCart()

  if (!cart) {
    return false
  }

  const response = await fetch(`/api/shop/cart/${cart._id}/voucher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return await response.json()
}

export const removeVoucher = async () => {
  const cart = await getCart()

  if (!cart) {
    return false
  }

  const response = await fetch(`/api/shop/cart/${cart._id}/voucher`, {
    method: "DELETE",
  })

  return response.ok
}

export const checkOutStripe = async (saveCardForFuture = false) => {
  try {
    const response = await fetch(
      `/api/shop/checkout?saveCardForFuture=${saveCardForFuture}`,
      {
        method: "POST",
      }
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "An error occurred")
    }

    return data
  } catch (error) {
    return {
      canCheckout: false,
      message: error.message,
    }
  }
}

export const hasMixedProductTypes = (cart) => {
  if (!cart.products) {
    return false
  }

  const hasSubscription = cart.products.some(
    (item) => item.product.subscription
  )
  const hasOneTimePurchase = cart.products.some(
    (item) => !item.product.subscription
  )

  if (hasSubscription) {
    const billingCycles = new Set()
    cart.products.forEach((item) => {
      if (item.product.subscription) {
        billingCycles.add(item.billingCycle)
      }
    })

    if (billingCycles.size > 1) {
      return true
    }
  }

  return hasSubscription && hasOneTimePurchase
}

export const hasSubscriptions = (cart) => {
  if (!cart?.products) {
    return false
  }

  return cart.products.some((item) => item.product.subscription)
}

export const updateBillingCycle = async (productId, billingCycle) => {
  try {
    const cart = await getCart()

    if (!cart) {
      return false
    }

    const params = new URLSearchParams({
      action: "updateBillingCycle",
      productId,
      billingCycle,
    })
    const response = await fetch(
      `/api/shop/cart/${cart._id}?${params.toString()}`
    )

    return response.ok
  } catch {
    return false
  }
}

export const updateCartBillingAddress = async (cartId, address) => {
  try {
    const response = await fetch(`/api/shop/cart/${cartId}/billing-address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    })

    if (!response.ok) {
      throw new Error("Failed to update billing address")
    }

    return await response.json()
  } catch (error) {
    throw new Error(error.message)
  }
}
