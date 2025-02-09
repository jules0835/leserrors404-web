import mongoose from "mongoose"
import { logSchema } from "@/db/schemas/logSchema"

export const LogModel = mongoose.models?.Log || mongoose.model("Log", logSchema)
