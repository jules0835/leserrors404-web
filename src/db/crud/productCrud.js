import { ProductModel } from "@/db/models/ProductModel"
import { mwdb } from "@/api/mwdb"
import { deletePublicPicture } from "@/utils/database/blobService"

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

    const pictureUrl = product.picture

    if (pictureUrl) {
      await deletePublicPicture(pictureUrl)
    }

    return { success: true, message: "Product deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete product" }
  }
}
