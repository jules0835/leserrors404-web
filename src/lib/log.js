import { createLog } from "@/db/crud/logCrud"
import { logCriticalityKeys } from "@/assets/options/config"

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

export default log
