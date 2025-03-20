export const fetchOrderDetails = async (orderId) => {
  const response = await fetch(`/api/user/dashboard/business/orders/${orderId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch order details")
  }

  return response.json()
}

export const getStatusColor = (status) => {
  const colors = {
    RECEIVED: "bg-blue-500",
    PAID: "bg-green-500",
    CANCEL: "bg-red-500",
    REFUND: "bg-yellow-500",
    PENDING: "bg-orange-500",
    FAILED: "bg-red-500",
    COMPLETED: "bg-green-500",
    WAITING_COMPLETION: "bg-blue-500",
  }

  return colors[status] || "bg-gray-500"
}
