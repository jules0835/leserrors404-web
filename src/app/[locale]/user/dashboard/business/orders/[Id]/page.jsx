"use client"
import UserOrderDetails from "@/features/user/business/orders/userOrderDetails"
import { useParams } from "next/navigation"

export default function Page() {
  const { id } = useParams()

  return (
    <div>
      <UserOrderDetails orderId={id} />
    </div>
  )
}
