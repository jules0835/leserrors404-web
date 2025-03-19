import { checkOrderExistBySessionId } from "@/db/crud/orderCrud"
import { createPaymentOrder } from "@/features/shop/checkout/utils/checkoutService"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  const { SessionId } = params
  const orderId = await checkOrderExistBySessionId(SessionId)

  if (orderId) {
    return NextResponse.json(
      { orderId, isSessionReady: true, isSessionExist: true },
      { status: 200 }
    )
  }

  const newPayementOrder = await createPaymentOrder(
    SessionId,
    "stripe_redirect_checkout"
  )

  if (newPayementOrder.isOrderCreated) {
    return NextResponse.json(
      {
        orderId: newPayementOrder.order._id,
        isSessionReady: true,
        isSessionExist: true,
      },
      { status: 200 }
    )
  }

  if (newPayementOrder.isPaymentFound) {
    return NextResponse.json(
      { orderId: null, isSessionReady: false, isSessionExist: true },
      { status: 200 }
    )
  }

  return NextResponse.json({ message: "Error" }, { status: 500 })
}
