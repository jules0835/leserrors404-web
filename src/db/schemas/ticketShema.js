import { Schema } from "mongoose"

export const ticketSchema = new Schema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: [
        "NOT_OPEN",
        "OPEN",
        "WAITING_FOR_USER",
        "WAITING_FOR_ADMIN",
        "CLOSED",
      ],
      default: "NOT_OPEN",
    },
    actions: [
      {
        type: String,
        enum: ["OPEN", "WAITING_FOR_USER", "WAITING_FOR_ADMIN", "CLOSED"],
        default: "OPEN",
      },
    ],
    actionsHistory: [
      {
        action: {
          type: String,
          enum: ["OPEN", "WAITING_FOR_USER", "WAITING_FOR_ADMIN", "CLOSED"],
        },
        comment: { type: String, default: null },
        actionDate: { type: Date, default: Date.now },
        actionBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
)
