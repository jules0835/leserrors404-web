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

    await response.json()

    return true
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
