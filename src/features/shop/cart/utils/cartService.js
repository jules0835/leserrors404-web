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

export const addProductToCart = async (productId, quantity = 1) => {
  try {
    let cart = await getCart()

    cart ||= await initializeCart()

    if (!cart) {
      return false
    }

    const response = await fetch(
      `/api/shop/cart/${cart._id}?action=add&productId=${productId}&quantity=${quantity}`
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

export const updateProductQuantity = async (productId, quantity) => {
  try {
    const cart = await getCart()

    if (!cart) {
      return false
    }

    const response = await fetch(
      `/api/shop/cart/${cart._id}?action=update&productId=${productId}&quantity=${quantity}`
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

export const checkOutStripe = async () => {
  try {
    const cart = await getCart()

    if (!cart) {
      return { url: null, canCheckout: false }
    }

    const response = await fetch(`/api/shop/checkout`, {
      method: "POST",
    })

    return response.json()
  } catch (error) {
    return { url: null, canCheckout: false }
  }
}

export const hasMixedProductTypes = (cart) => {
  const hasSubscription = cart.products.some(
    (item) => item.product.subscription
  )
  const hasOneTimePurchase = cart.products.some(
    (item) => !item.product.subscription
  )

  return hasSubscription && hasOneTimePurchase
}
