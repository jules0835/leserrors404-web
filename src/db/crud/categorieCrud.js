import { CategorieModel } from "@/db/models/CategorieModel"
import { mwdb } from "@/api/mwdb"

export const existingCategorie = async (label) => {
  await mwdb()

  const existingCategorieRes = await CategorieModel.findOne({ label })

  return Boolean(existingCategorieRes)
}

export const findCategorie = async (query) => {
  await mwdb()

  const Categorie = await CategorieModel.findOne(query)

  return Categorie
}

export const createCategorie = async (Categorie) => {
  await mwdb()
  const newCategorie = await CategorieModel.create(Categorie)

  return newCategorie
}

export const getCategories = async (size = 10, page = 1, query = "") => {
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
    const total = await CategorieModel.countDocuments(searchQuery)
    const Categories = await CategorieModel.find(searchQuery)
      .limit(size)
      .skip(size * (page - 1))

    return { Categories, total }
  } catch (error) {
    return { Categories: [], total: 0 }
  }
}

export const updateCategorie = async (id, data) => {
  await mwdb()

  try {
    const Categorie = await CategorieModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    })

    return Categorie
  } catch (error) {
    return null
  }
}

export const deleteCategorie = async (id) => {
  await mwdb()

  try {
    const Categorie = await CategorieModel.findOneAndDelete({ _id: id })

    if (!Categorie) {
      return { success: false, message: "Categorie not found" }
    }

    return { success: true, message: "Categorie deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete Categorie" }
  }
}
