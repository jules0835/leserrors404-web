import mongoose from "mongoose"
import { chatSchema } from "@/db/schemas/chatSchema"

export const ChatModel =
  mongoose.models?.Chat || mongoose.model("Chat", chatSchema)
