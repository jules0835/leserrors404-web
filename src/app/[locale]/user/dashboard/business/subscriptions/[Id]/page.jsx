"use client"
import UserSubscriptionDetails from "@/features/user/business/subscriptions/userSubscriptionDetails"
import { useParams } from "next/navigation"

export default function Page() {
  const { id } = useParams()

  return <UserSubscriptionDetails subscriptionId={id} />
}
