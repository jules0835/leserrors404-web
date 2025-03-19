import { CartModel, VoucherModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"
import crypto from "crypto"

export const findValidVoucherByCode = async (code) => {
  await mwdb()

  return VoucherModel.findOne({
    code,
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  })
}

export const applyVoucherToCart = async (cartId, voucherId) => {
  await mwdb()

  return CartModel.findByIdAndUpdate(
    cartId,
    { voucher: voucherId },
    { new: true }
  ).populate(["products.product", "voucher"])
}

export const getVouchersList = async (size = 10, page = 1, query = "") => {
  try {
    await mwdb()
    const searchQuery = query
      ? {
          $or: [
            { code: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        }
      : {}
    const total = await VoucherModel.countDocuments(searchQuery)
    const vouchers = await VoucherModel.find(searchQuery)
      .limit(size)
      .skip(size * (page - 1))

    return { vouchers, total }
  } catch (error) {
    return { vouchers: [], total: 0 }
  }
}

export const createVoucher = async (voucherData) => {
  try {
    await mwdb()

    voucherData.code ||= crypto.randomBytes(4).toString("hex").toUpperCase()

    const newVoucher = new VoucherModel(voucherData)
    await newVoucher.save()

    return newVoucher
  } catch (error) {
    throw new Error("Failed to create voucher")
  }
}
