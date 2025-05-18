import { Schema } from "mongoose"

export const salesfrontSchema = new Schema({
  name: { type: String, required: true, unique: true },
  isBanner: { type: Boolean, default: false },
  isCarousel: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  image: { type: String },
  icon: { type: String },
  color: { type: String },
  isLayout: { type: Boolean, default: false },
  titleTrans: {
    type: Object,
    default: {},
  },
  descriptionTrans: {
    type: Object,
    default: {},
  },
  alertBanner: {
    isActive: { type: Boolean, default: false },
    style: {
      type: String,
      enum: ["info", "promo", "warning", "error"],
      default: "info",
    },
    titleTrans: {
      type: Object,
      default: {},
    },
    descriptionTrans: {
      type: Object,
      default: {},
    },
  },
  carouselParts: [
    {
      titleTrans: {
        type: Object,
        default: {},
      },
      descriptionTrans: {
        type: Object,
        default: {},
      },
      image: { type: String },
      link: { type: String },
      isActive: { type: Boolean, default: true },
      position: { type: Number, default: 0 },
    },
  ],
})
