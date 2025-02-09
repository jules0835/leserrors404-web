import { LogModel } from "@/db/models/LogModel"
import { mwdb } from "@/api/mwdb"

export const createLog = async (logData) => {
  await mwdb()
  const logEntry = new LogModel(logData)
  await logEntry.save()
}

export const getLogsByUserId = async (userId) => {
  await mwdb()
  return await LogModel.find({ userId })
}

export const getAdminLogs = async () => {
  await mwdb()
  return await LogModel.find({ isAdminAction: true })
}

export const getErrorLogs = async () => {
  await mwdb()
  return await LogModel.find({ isError: true })
}

export const getAllLogs = async () => {
  await mwdb()
  return await LogModel.find({})
}

export const getLoginFailLogs = async () => {
  await mwdb()
  return await LogModel.find({ logKey: "loginAttempFail" })
}

export const getProductionErrorLogs = async () => {
  await mwdb()
  return await LogModel.find({ logKey: "AlertProd" })
}
