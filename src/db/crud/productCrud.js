/* eslint-disable require-unicode-regexp */
/* eslint-disable max-params */
import { ProductModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"
import { webAppSettings } from "@/assets/options/config"
import mongoose from "mongoose"

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

export const findProductById = async (id) => {
  await mwdb()

  const product = await ProductModel.findById(id)

  return product
}

export const findShopProductById = async (id) => {
  await mwdb()

  const product = await ProductModel.findOne({ _id: id, isActive: true })

  return product
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

export const getShopProducts = async ({
  query = "",
  size = 10,
  page = 1,
  minPrice,
  maxPrice,
  categories,
  sort,
  availability,
  keywords,
  dateFrom,
  dateTo,
}) => {
  try {
    await mwdb()

    const searchQuery = { isActive: true }

    if (minPrice || maxPrice) {
      searchQuery.price = {}

      if (minPrice) {
        searchQuery.price.$gte = Number(minPrice)
      }

      if (maxPrice) {
        searchQuery.price.$lte = Number(maxPrice)
      }
    }

    if (categories && categories.length > 0) {
      const categoryObjectIds = categories.map(
        (id) => new mongoose.Types.ObjectId(id)
      )
      searchQuery.category = { $in: categoryObjectIds }
    }

    if (availability === "in-stock") {
      searchQuery.stock = { $gt: 0 }
    } else if (availability === "out-of-stock") {
      searchQuery.stock = { $eq: 0 }
    }

    if (dateFrom || dateTo) {
      searchQuery.createdAt = {}

      if (dateFrom) {
        searchQuery.createdAt.$gte = new Date(dateFrom)
      }

      if (dateTo) {
        searchQuery.createdAt.$lte = new Date(dateTo)
      }
    }

    if (query || keywords) {
      const searchText = query || keywords
      const searchRegex = new RegExp(searchText.split("").join(".*"), "i")
      const { locales } = webAppSettings.translation
      const searchableFields = ["label", "description", "characteristics"]

      searchQuery.$or ||= []

      locales.forEach((locale) => {
        searchableFields.forEach((field) => {
          searchQuery.$or.push({
            [`${field}.${locale}`]: { $regex: searchRegex },
          })
        })
      })
    }

    let sortOptions = {}

    switch (sort) {
      case "price-asc":
        sortOptions = { price: 1 }

        break

      case "price-desc":
        sortOptions = { price: -1 }

        break

      case "popular":
        sortOptions = { salesCount: -1 }

        break

      default:
        sortOptions = { createdAt: -1 }
    }

    const total = await ProductModel.countDocuments(searchQuery)
    const Products = await ProductModel.find(searchQuery)
      .sort(sortOptions)
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

export const getProductByStripeId = async (stripeId) => {
  await mwdb()
  const product = await ProductModel.findOne({ stripeProductId: stripeId })

  return product
}
