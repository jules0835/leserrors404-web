import { logKeys, logCriticalityKeys } from "@/assets/options/config"

export const getLogKeyTitle = (key, t) => {
  const logKey = Object.values(logKeys).find((log) => log.key === key)

  return logKey ? t(logKey.titleKey) : key
}
export const getLogLevelTitle = (level, t) => {
  const logLevel = Object.values(logCriticalityKeys).find(
    (log) => log.key === level
  )

  return logLevel ? t(logLevel.titleKey) : level
}

export const getBackgroundColor = (logLevel) => {
  switch (logLevel) {
    case "userError":
      return "bg-orange-200 rounded-md"

    case "userSecurity":
      return "bg-red-200 rounded-md"

    case "systemSecurity":
      return "bg-red-200 rounded-md"

    case "systemError":
      return "bg-red-200 rounded-md"

    default:
      return ""
  }
}

export const returnIconLogLevel = (logLevel) => {
  const logCriticality = logCriticalityKeys[logLevel]

  return logCriticality ? logCriticality.icon : null
}

export const returnReqParams = (req) => {
  const { method, cookies, headers } = req

  return { method, cookies, headers }
}
