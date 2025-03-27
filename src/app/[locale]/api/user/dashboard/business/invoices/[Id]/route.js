import { getOrderByInvoiceId } from "@/db/crud/orderCrud"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"
import stripe from "@/utils/stripe/stripe"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  const { Id } = await params
  const userId = getReqUserId(req)
  const isAdmin = getReqIsAdmin(req)
  const order = await getOrderByInvoiceId(Id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  if (!isAdmin && order.user._id.toString() !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const invoice = await stripe.invoices.retrieve(order.stripe.invoiceId)

  return NextResponse.json({ invoiceUrl: invoice.hosted_invoice_url })
}
