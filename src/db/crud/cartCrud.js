import { CartModel } from "@/db/models/CartModel"
import { mwdb } from "@/api/mwdb"

export const createCart = async (data) => {
  await mwdb()

  return CartModel.create(data)
}

export const findCart = async (query) => {
  await mwdb()

  const cart = await CartModel.findOne(query).populate("products.product")

  return cart
}

export const addToCart = async (cartId, productId, quantity) => {
  await mwdb()
  const cart = await CartModel.findById(cartId)
  const existingProduct = cart.products.find(
    (p) => p.product.toString() === productId
  )

  if (existingProduct) {
    existingProduct.quantity += quantity
  } else {
    cart.products.push({ product: productId, quantity })
  }

  cart.updatedAt = new Date()

  return cart.save()
}

export const removeFromCart = async (cartId, productId) => {
  await mwdb()

  return CartModel.findByIdAndUpdate(
    cartId,
    {
      $pull: { products: { product: productId } },
      updatedAt: new Date(),
    },
    { new: true }
  ).populate("products.product")
}

export const updateQuantity = async (cartId, productId, quantity) => {
  await mwdb()

  return CartModel.findOneAndUpdate(
    { _id: cartId, "products.product": productId },
    {
      $set: { "products.$.quantity": quantity },
      updatedAt: new Date(),
    },
    { new: true }
  ).populate("products.product")
}

export const clearCartProducts = async (cartId) => {
  await mwdb()

  return CartModel.findByIdAndUpdate(
    cartId,
    {
      products: [],
      updatedAt: new Date(),
    },
    { new: true }
  )
}

export const mergeCart = async (userId, tempCartId) => {
  await mwdb()

  const [userCart, tempCart] = await Promise.all([
    CartModel.findOne({ user: userId }),
    CartModel.findById(tempCartId),
  ])

  if (!userCart || !tempCart) {
    return null
  }

  for (const tempItem of tempCart.products) {
    const existingProduct = userCart.products.find(
      (p) => p.product.toString() === tempItem.product.toString()
    )

    if (existingProduct) {
      existingProduct.quantity += tempItem.quantity
    } else {
      userCart.products.push(tempItem)
    }
  }

  await userCart.save()
  await CartModel.findByIdAndDelete(tempCartId)

  return userCart.populate("products.product")
}
