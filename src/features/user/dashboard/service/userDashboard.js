export const getUserDashboardData = async () => {
  const response = await fetch("/api/user/dashboard")

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  return response.json()
}
