export const fetchCheckoutOrder = async (sessionId) => {
  const response = await fetch(`/api/shop/checkout/redirect/${sessionId}`)

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}
