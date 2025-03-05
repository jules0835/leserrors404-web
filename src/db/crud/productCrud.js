/* eslint-disable require-unicode-regexp */
/* eslint-disable max-params */
import { ProductModel } from "@/db/models/ProductModel"
import { mwdb } from "@/api/mwdb"
import { webAppSettings } from "@/assets/options/config"

export const existingProduct = async (label) => {
  await mwdb()

  const existingProductRes = await ProductModel.findOne({ label })

  return Boolean(existingProductRes)
}

export const findProduct = async (query) => {
  await mwdb()

  const Product = await ProductModel.findOne(query)

  return Product
}

export const createProduct = async (product) => {
  await mwdb()
  const newProduct = await ProductModel.create(product)

  return newProduct
}

export const getProducts = async (size = 10, page = 1, query = "") => {
  try {
    await mwdb()
    const searchQuery = query
      ? {
          $or: [
            { label: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { picture: { $regex: query, $options: "i" } },
          ],
        }
      : {}
    const total = await ProductModel.countDocuments(searchQuery)
    const Products = await ProductModel.find(searchQuery)
      .limit(size)
      .skip(size * (page - 1))

    return { Products, total }
  } catch (error) {
    return { Products: [], total: 0 }
  }
}

export const getShopProducts = async (query = "", size = 10, page = 1) => {
  try {
    await mwdb()

    const searchQuery = { isActive: true }

    if (query) {
      const searchRegex = new RegExp(query.split("").join(".*"), "i")
      const { locales } = webAppSettings.translation
      const searchableFields = ["label", "description", "characteristics"]

      searchQuery.$or = []

      locales.forEach((locale) => {
        searchableFields.forEach((field) => {
          searchQuery.$or.push({
            [`${field}.${locale}`]: { $regex: searchRegex },
          })
        })
      })
    }

    const total = await ProductModel.countDocuments(searchQuery)
    const Products = await ProductModel.find(searchQuery)
      .limit(size)
      .skip(size * (page - 1))
      .lean()

    return { Products, total }
  } catch (error) {
    return { Products: [], total: 0 }
  }
}

export const updateProduct = async (id, data) => {
  await mwdb()

  try {
    const product = await ProductModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    })

    return product
  } catch (error) {
    return null
  }
}

export const deleteProduct = async (id) => {
  await mwdb()

  try {
    const product = await ProductModel.findOneAndDelete({ _id: id })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    return { success: true, message: "Product deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete product" }
  }
}
