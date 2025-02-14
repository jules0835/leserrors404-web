/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
import { createLog } from "@/db/crud/logCrud"
import { logCriticalityKeys } from "@/assets/options/config"

/**
 * @typedef {Object} LogData
 * @property {string} logKey
 * @property {string} message
 * @property {string} [technicalMessage]
 * @property {boolean} [isError]
 * @property {boolean} [isAdminAction]
 * @property {string} [deviceType]
 * @property {string} [userId]
 * @property {Date} [date]
 * @property {Object} [data]
 * @property {Object} [oldData]
 * @property {Object} [newData]
 */

/**
 * @param {string} level
 * @returns {(logData: LogData) => Promise<void>}
 */

const createLogger = (level) => {
  return async (logData) => {
    await createLog({
      logLevel: level,
      ...logData,
    })

    console.log(`[${level.toUpperCase()}] - ${logData.message}`)
  }
}

export const log = {
  userInfo: createLogger(logCriticalityKeys.userInfo.key),
  userError: createLogger(logCriticalityKeys.userError.key),
  userSecurity: createLogger(logCriticalityKeys.userSecurity.key),
  systemInfo: createLogger(logCriticalityKeys.systemInfo.key),
  systemSecurity: createLogger(logCriticalityKeys.systemSecurity.key),
  systemError: createLogger(logCriticalityKeys.systemError.key),
}

/**
 * @param {string} level
 * @param {LogData} logData
 * @returns {Promise<void>}
 */
