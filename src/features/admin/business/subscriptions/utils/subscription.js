export const fetchSubscriptionDetails = async (subscriptionId) => {
  const response = await fetch(
    `/api/admin/business/subscriptions/${subscriptionId}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch subscription")
  }

  return response.json()
}
export const updateSubscription = async ({ subscriptionId, action }) => {
  const response = await fetch(
    `/api/admin/business/subscriptions/${subscriptionId}`,
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
