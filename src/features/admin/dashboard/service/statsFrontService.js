export const getDashboardStats = async () => {
  const response = await fetch("/api/admin/dashboard/global-stats")

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats")
  }

  return response.json()
}

export const getLatestLogs = async () => {
  const response = await fetch("/api/admin/dashboard/latest-logs")

  if (!response.ok) {
    throw new Error("Failed to fetch latest logs")
  }

  return response.json()
}

export const getLatestOrders = async () => {
  const response = await fetch("/api/admin/dashboard/latest-orders")

  if (!response.ok) {
    throw new Error("Failed to fetch latest orders")
  }

  return response.json()
}

export const getOrderStats = async (period = "7d", realTime = true) => {
  const response = await fetch(
    `/api/admin/dashboard/order-stats?period=${period}&realTime=${realTime}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch order stats")
  }

  return response.json()
}

export const getLatestTickets = async () => {
  const response = await fetch("/api/admin/dashboard/latest-tickets")

  if (!response.ok) {
    throw new Error("Failed to fetch latest tickets")
  }

  return response.json()
}

export const getMessageTypeColor = (messageType) => {
  if (messageType.type === "action") {
    return messageType.isDone
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800"
  }

  if (messageType.type === "user") {
    return "bg-blue-100 text-blue-800"
  }

  if (messageType.type === "admin") {
    return "bg-purple-100 text-purple-800"
  }

  return "bg-gray-100 text-gray-800"
}

export const getMessageTypeText = (messageType, t) => {
  if (messageType.type === "action") {
    return messageType.isDone ? t("actionDone") : t("waitingAction")
  }

  return t(messageType.type)
}
