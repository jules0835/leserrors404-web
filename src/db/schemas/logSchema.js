import { Schema } from "mongoose"

export const logSchema = new Schema({
  logLevel: { type: String, required: true },
  logKey: { type: String, required: true },
  message: { type: String, required: true },
  technicalMessage: { type: String, required: false, default: "" },
  isError: { type: Boolean, default: false },
  isAdminAction: { type: Boolean, default: false },
  deviceType: { type: String, default: "" },
  authorId: { type: String, default: "System" },
  userId: { type: String, default: null },
  date: { type: Date, default: Date.now },
  data: { type: Object, default: {} },
  oldData: { type: Object, default: {} },
  newData: { type: Object, default: {} },
})
