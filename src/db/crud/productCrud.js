/* eslint-disable require-unicode-regexp */
/* eslint-disable max-params */
import { ProductModel, OrderModel } from "@/db/models/indexModels"
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
  category,
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

    if (category) {
      searchQuery.categorie = category
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

export const getProductStats = async () => {
  await mwdb()

  const stockStats = await ProductModel.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "categories",
        localField: "categorie",
        foreignField: "_id",
        as: "categorieDetails",
      },
    },
    { $unwind: "$categorieDetails" },
    {
      $group: {
        _id: "$_id",
        totalStock: { $sum: "$stock" },
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        product: { $first: "$$ROOT" },
        categorie: { $first: "$categorieDetails" },
      },
    },
    { $sort: { totalStock: -1 } },
    { $limit: 10 },
  ])
  const salesStats = await OrderModel.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "productDetails.categorie",
        foreignField: "_id",
        as: "categorieDetails",
      },
    },
    { $unwind: "$categorieDetails" },
    {
      $group: {
        _id: "$products.productId",
        totalSales: { $sum: "$products.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
        product: { $first: "$productDetails" },
        categorie: { $first: "$categorieDetails" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 10 },
  ])

  return {
    stockStats,
    salesStats,
  }
}

export const getCategoriesStats = async () => {
  await mwdb()

  const stockStats = await ProductModel.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "categories",
        localField: "categorie",
        foreignField: "_id",
        as: "categorieDetails",
      },
    },
    { $unwind: "$categorieDetails" },
    {
      $group: {
        _id: "$categorie",
        totalStock: { $sum: "$stock" },
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        products: { $push: "$$ROOT" },
        categorie: { $first: "$categorieDetails" },
        productCount: { $sum: 1 },
      },
    },
    { $sort: { totalStock: -1 } },
  ])
  const salesStats = await OrderModel.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "productDetails.categorie",
        foreignField: "_id",
        as: "categorieDetails",
      },
    },
    { $unwind: "$categorieDetails" },
    {
      $group: {
        _id: "$productDetails.categorie",
        totalSales: { $sum: "$products.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
        products: { $push: "$productDetails" },
        categorie: { $first: "$categorieDetails" },
      },
    },
    { $sort: { totalSales: -1 } },
  ])
  const totalCategories = stockStats.length
  const averageStockPerCategory =
    stockStats.reduce((sum, item) => sum + item.totalStock, 0) / totalCategories

  return {
    stockStats,
    salesStats,
    totalCategories,
    averageStockPerCategory,
  }
}
