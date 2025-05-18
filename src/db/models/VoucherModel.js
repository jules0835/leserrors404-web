import mongoose from "mongoose"
import { voucherSchema } from "@/db/schemas/voucherSchema"

export const VoucherModel =
  mongoose.models?.Voucher || mongoose.model("Voucher", voucherSchema)
