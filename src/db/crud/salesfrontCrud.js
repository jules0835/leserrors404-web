import { SalesfrontModel } from "@/db/models/SalesfrontModel"
import { mwdb } from "@/api/mwdb"

export const createSalesfront = async (salesfront) => {
  await mwdb()

  return await SalesfrontModel.create(salesfront)
}

export const findSalesfront = async (query) => {
  await mwdb()

  return await SalesfrontModel.findOne(query)
}

export const updateSalesfront = async (query, update) => {
  await mwdb()

  return await SalesfrontModel.findOneAndUpdate(query, update, { new: true })
}
