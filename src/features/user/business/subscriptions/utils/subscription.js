export const getSubscriptionStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-500"

    case "canceled":
      return "bg-red-500"

    case "past_due":
      return "bg-orange-500"

    case "unpaid":
      return "bg-gray-500"

    case "paused":
      return "bg-yellow-500"

    case "incomplete":
      return "bg-gray-500"

    case "incomplete_expired":
      return "bg-gray-500"

    case "preCanceled":
      return "bg-orange-500"

    default:
      return "bg-gray-500"
  }
}
export const fetchSubscriptionDetails = async (subscriptionId) => {
  const response = await fetch(
    `/api/user/dashboard/business/subscriptions/${subscriptionId}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch subscription")
  }

  return response.json()
}
export const updateSubscription = async ({ subscriptionId, action }) => {
  const response = await fetch(
    `/api/user/dashboard/business/subscriptions/${subscriptionId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update subscription")
  }

  return response.json()
}
