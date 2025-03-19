import React from "react"
import "tailwindcss/tailwind.css"

const OrderSummary = ({ order }) => (
  <div className="bg-gray-900 text-white shadow-md rounded-lg p-6 mt-4">
    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
    <ul className="list-disc pl-5">
      {order.items.map((item, index) => (
        <li key={index} className="mb-2">
          {item.name} - {item.quantity} x {item.price}€
        </li>
      ))}
    </ul>
    <p className="mt-4 font-semibold">Total: {order.total}€</p>
  </div>
)

export default function CheckOutSuccessPage() {
  const order = {
    items: [
      { name: "Product 1", quantity: 2, price: 20 },
      { name: "Product 2", quantity: 1, price: 50 },
    ],
    total: 90,
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-extrabold text-green-400 mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-green-300">
          Your order has been successfully processed.
        </p>
      </div>
      <OrderSummary order={order} />
      <div className="mt-8 flex space-x-4">
        <div className="animate-spin-slow inline-flex h-12 w-12 rounded-full border-4 border-t-green-400 border-b-transparent"></div>
        <div className="animate-spin-slow inline-flex h-12 w-12 rounded-full border-4 border-t-green-500 border-b-transparent"></div>
        <div className="animate-spin-slow inline-flex h-12 w-12 rounded-full border-4 border-t-green-600 border-b-transparent"></div>
      </div>
    </div>
  )
}
