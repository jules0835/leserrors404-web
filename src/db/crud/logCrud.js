/* eslint-disable max-depth */
/* eslint-disable max-params */
import { LogModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"
import { isValidObjectId, findUserById } from "@/db/utils/dbUtils"

export const createLog = async (logData) => {
  await mwdb()
  const logEntry = new LogModel(logData)
  await logEntry.save()
}

export const getLogsByUserId = async (userId) => {
  await mwdb()

  return await LogModel.find({
    $or: [
      { userId },
      { authorId: userId },
      { "data.userId": userId },
      { "newData.userId": userId },
      { "oldData.userId": userId },
    ],
  })
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

export const getLogs = async (
  limit,
  page,
  query,
  sortField,
  sortOrder,
  filter,
  date,
  logKeys = []
) => {
  await mwdb()

  const searchQuery = {
    ...(query
      ? {
          $or: [
            { logLevel: { $regex: query, $options: "i" } },
            { logKey: { $regex: query, $options: "i" } },
            { message: { $regex: query, $options: "i" } },
            { technicalMessage: { $regex: query, $options: "i" } },
            { deviceType: { $regex: query, $options: "i" } },
            { data: { $regex: query, $options: "i" } },
            { oldData: { $regex: query, $options: "i" } },
            { newData: { $regex: query, $options: "i" } },
            { shortId: { $regex: query, $options: "i" } },
          ],
        }
      : {}),
    ...(filter ? { logLevel: filter } : {}),
    ...(Array.isArray(logKeys) && logKeys.length > 0
      ? { logKey: { $in: logKeys } }
      : {}),
    ...(date
      ? {
          date: {
            $gte: new Date(date),
            $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        }
      : {}),
  }
  const sortQuery = sortField
    ? { [sortField]: sortOrder === "asc" ? 1 : -1, date: -1 }
    : { date: -1 }
  const logs = await LogModel.find(searchQuery)
    .sort(sortQuery)
    .limit(limit)
    .skip((page - 1) * limit)
    .exec()
  const logsWithUserDetails = await Promise.all(
    logs.map(async (log) => {
      const logObject = log.toObject()

      if (log.userId) {
        if (isValidObjectId(log.userId)) {
          const user = await findUserById(log.userId)

          // eslint-disable-next-line max-depth
          if (user) {
            logObject.userName = `${user.firstName} ${user.lastName}`
          }
        }
      }

      if (log.authorId) {
        if (isValidObjectId(log.authorId)) {
          const author = await findUserById(log.authorId)

          // eslint-disable-next-line max-depth
          if (author) {
            logObject.authorName = `${author.firstName} ${author.lastName}`
          }
        }
      }

      return logObject
    })
  )
  const total = await LogModel.countDocuments(searchQuery).exec()

  return { logs: logsWithUserDetails, total }
}

export const getLogById = async (logId) => {
  await mwdb()

  let log = await LogModel.findById(logId)

  if (log) {
    log = log.toObject()

    if (log.userId) {
      if (isValidObjectId(log.userId)) {
        const user = await findUserById(log.userId)

        if (user) {
          log.userName = `${user.firstName} ${user.lastName}`
        }
      }
    }

    if (log.authorId) {
      if (isValidObjectId(log.authorId)) {
        const author = await findUserById(log.authorId)

        if (author) {
          log.authorName = `${author.firstName} ${author.lastName}`
        }
      }
    }
  }

  return { log }
}

export const getUserLogs = async (userId, limit, page) => {
  await mwdb()

  const logs = await LogModel.find({
    $or: [
      { userId },
      { authorId: userId },
      { "data.userId": userId },
      { "newData.userId": userId },
      { "oldData.userId": userId },
    ],
  })
    .sort({ date: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec()
  const logsWithUserDetails = await Promise.all(
    logs.map(async (log) => {
      const logObject = log.toObject()

      if (log.userId) {
        if (isValidObjectId(log.userId)) {
          const user = await findUserById(log.userId)

          // eslint-disable-next-line max-depth
          if (user) {
            logObject.userName = `${user.firstName} ${user.lastName}`
          }
        }
      }

      if (log.authorId) {
        if (isValidObjectId(log.authorId)) {
          const author = await findUserById(log.authorId)

          // eslint-disable-next-line max-depth
          if (author) {
            logObject.authorName = `${author.firstName} ${author.lastName}`
          }
        }
      }

      return logObject
    })
  )
  const total = await LogModel.countDocuments({
    $or: [
      { userId },
      { "data.userId": userId },
      { "newData.userId": userId },
      { "oldData.userId": userId },
    ],
  }).exec()

  return { logs: logsWithUserDetails, total }
}
