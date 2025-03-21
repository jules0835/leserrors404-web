import { CartModel, VoucherModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"
import { hasMixedProductTypes } from "@/features/shop/cart/utils/cartService"
import { checkUserOrderEligibility } from "@/db/crud/userCrud"

export const createCart = async (data) => {
  await mwdb()

  return CartModel.create(data)
}

export const findCart = async (query) => {
  await mwdb()

  const cart = await CartModel.findOne(query).populate(
    "products.product voucher"
  )

  return await calculateCartTotals(cart)
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

export const checkCartEligibilityForCheckout = async (cart, query) => {
  let cartToCheck = cart

  if (!cart) {
    cartToCheck = await findCart(query)
  }

  if (!cartToCheck) {
    throw new Error("Cart not found")
  }

  if (!cartToCheck.products) {
    return {
      canCheckout: false,
      cart: cartToCheck,
      reason: "CART_EMPTY",
    }
  }

  const mixedProduct = hasMixedProductTypes(cartToCheck)

  if (mixedProduct) {
    return {
      canCheckout: false,
      cart: cartToCheck,
      reason: "MIXED_PRODUCT_TYPES",
    }
  }

  const userEligibility = await checkUserOrderEligibility(cartToCheck.user)

  if (!userEligibility.isEligible) {
    return {
      canCheckout: false,
      cart: cartToCheck,
      reason: "USER_PROFILE_INCOMPLETE",
    }
  }

  if (cartToCheck.voucher && !cartToCheck.voucher.isActive) {
    return {
      canCheckout: false,
      cart: cartToCheck,
      reason: "VOUCHER_NOT_ACTIVE",
    }
  }

  if (cartToCheck.products.some((item) => !item.product.isActive)) {
    return {
      canCheckout: false,
      cart: cartToCheck,
      reason: "PRODUCT_NOT_ACTIVE",
    }
  }

  return { canCheckout: true, cart: cartToCheck }
}

export const resetUserCart = async (userId) => {
  await mwdb()

  return CartModel.findOneAndUpdate(
    { user: userId },
    {
      products: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      voucher: null,
      updatedAt: new Date(),
      checkout: {
        isEligible: false,
        reason: "",
      },
    },
    { new: true }
  )
}
const calculateCartTotals = async (cart) => {
  await cart.populate("products.product voucher")
  const subtotal = cart.products.reduce((sum, item) => {
    let itemPrice = 0

    if (item.product.subscription) {
      itemPrice =
        item.billingCycle === "year"
          ? item.product.priceAnnual
          : item.product.priceMonthly
    } else {
      itemPrice = item.product.price
    }

    return sum + itemPrice * item.quantity
  }, 0)

  let discount = 0

  if (cart.voucher) {
    discount =
      cart.voucher.type === "percentage"
        ? subtotal * (cart.voucher.amount / 100)
        : Math.min(cart.voucher.amount, subtotal)
  }

  const discountedSubtotal = subtotal - discount
  const totalTax = cart.products.reduce((sum, item) => {
    let itemPrice = 0

    if (item.product.subscription) {
      itemPrice =
        item.billingCycle === "year"
          ? item.product.priceAnnual
          : item.product.priceMonthly
    } else {
      itemPrice = item.product.price
    }

    const itemPriceAfterDiscount = itemPrice - (discount / subtotal) * itemPrice
    const productTaxAmount =
      itemPriceAfterDiscount * (item.product.taxe / 100) * item.quantity

    return sum + productTaxAmount
  }, 0)
  const total = Math.max(discountedSubtotal + totalTax, 0)

  cart.subtotal = subtotal
  cart.discount = discount
  cart.tax = totalTax
  cart.total = total

  cart.checkout = {
    isEligible: false,
    reason: "",
  }

  if (cart.user) {
    const eligibility = await checkCartEligibilityForCheckout(cart, null)
    cart.checkout.isEligible = eligibility.canCheckout
    cart.checkout.reason = eligibility.reason || ""
  } else {
    cart.checkout.isEligible = false
    cart.checkout.reason = "USER_NOT_LOGGED_IN"
  }

  if (cart.isModified()) {
    await cart.save()
  }

  return cart
}
