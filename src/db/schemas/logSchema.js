import mongoose, { Schema } from "mongoose"
import { generateUniqueShortId } from "@/lib/utils"

export const logSchema = new Schema({
  shortId: {
    type: String,
    unique: true,
    index: true,
  },
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

logSchema.pre("save", async function ValidateShortId(next) {
  if (!this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Log.exists({ shortId: newId })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
