import mongoose, { Schema } from "mongoose"
import { generateUniqueShortId } from "@/lib/utils"

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  sender: { type: String, enum: ["BOT", "USER", "ADMIN"], required: true },
  readByUser: { type: Boolean, default: false },
  readByAdmin: { type: Boolean, default: false },
  message: { type: String },
  isAction: { type: Boolean, default: false },
  isActionDone: { type: Boolean, default: false },
  isBotQuery: { type: Boolean, default: false },
  action: {
    type: String,
    enum: ["SELECT_ORDER", "SELECT_SUBSCRIPTION", "CONTACT_HUMAN"],
    required() {
      return this.isAction
    },
  },
  isBotReply: { type: Boolean, default: false },
  botReplyKey: { type: String, default: null },
  needUserSelectBot: { type: Boolean, default: false },
  link: { type: String, default: null },
  linkType: {
    type: String,
    enum: ["internal", "external", null],
    default: null,
  },
  linkNeedLogin: { type: Boolean, default: false },
  botQuerySelectionOptions: [
    {
      transKey: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  sendDate: { type: Date, default: Date.now },
})

export const chatSchema = new Schema(
  {
    shortId: {
      type: String,
      unique: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    userName: { type: String, required: false },
    email: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isUserTyping: { type: Boolean, default: false },
    isAdminTyping: { type: Boolean, default: false },
    isUserTypingLastUpdate: { type: Date, default: null },
    isAdminTypingLastUpdate: { type: Date, default: null },
    closeBy: { type: String, enum: ["ADMIN", "USER", null], default: null },
    state: {
      type: String,
      enum: ["CHAT_BOT", "CHAT_ADMIN", "INBOX"],
      default: "CHAT_BOT",
    },
    messages: [messageSchema],
    adminSummary: { type: String, default: "" },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Subscription" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

chatSchema.pre("save", async function ValidateShortId(next) {
  if (this.isNew && !this.shortId) {
    const generateAndCheckId = async () => {
      const newId = generateUniqueShortId()
      const exists = await mongoose.models.Chat.exists({ shortId: newId })

      if (exists) {
        return generateAndCheckId()
      }

      return newId
    }

    this.shortId = await generateAndCheckId()
  }

  next()
})
