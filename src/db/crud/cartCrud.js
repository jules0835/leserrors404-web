import { CartModel, VoucherModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export const createCart = async (data) => {
  await mwdb()

  return CartModel.create(data)
}

export const findCart = async (query) => {
  await mwdb()

  const cart = await CartModel.findOne(query).populate(
    "products.product voucher"
  )

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

  await cart.save()

  return calculateCartTotals(cart)
}

export const removeFromCart = async (cartId, productId) => {
  await mwdb()

  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    {
      $pull: { products: { product: productId } },
      updatedAt: new Date(),
    },
    { new: true }
  ).populate("products.product")

  return calculateCartTotals(cart)
}

export const updateQuantity = async (cartId, productId, quantity) => {
  await mwdb()

  const cart = await CartModel.findOneAndUpdate(
    { _id: cartId, "products.product": productId },
    {
      $set: { "products.$.quantity": quantity },
      updatedAt: new Date(),
    },
    { new: true }
  ).populate("products.product")

  return calculateCartTotals(cart)
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

export const applyVoucherToCart = async (cartId, voucherCode) => {
  await mwdb()
  const voucher = await VoucherModel.findOne({
    code: voucherCode,
    isActive: true,
  })

  if (!voucher) {
    throw new Error("Voucher not found or inactive")
  }

  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    { voucher: voucher._id },
    { new: true }
  )

  return calculateCartTotals(cart)
}

export const removeVoucherFromCart = async (cartId) => {
  await mwdb()
  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    { $unset: { voucher: "" } },
    { new: true }
  )

  return calculateCartTotals(cart)
}

const calculateCartTotals = async (cart) => {
  await cart.populate("products.product voucher")

  const subtotal = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  let discount = 0

  if (cart.voucher) {
    discount =
      cart.voucher.type === "percentage"
        ? subtotal * (cart.voucher.amount / 100)
        : Math.min(cart.voucher.amount, subtotal)
  }

  const taxableAmount = subtotal - discount
  const tax = cart.products.reduce((sum, item) => {
    const productTaxAmount =
      item.product.price * (item.product.taxe / 100) * item.quantity

    return sum + productTaxAmount
  }, 0)
  const total = taxableAmount + tax

  cart.subtotal = subtotal
  cart.discount = discount
  cart.tax = tax
  cart.total = total

  await cart.save()

  return cart
}
