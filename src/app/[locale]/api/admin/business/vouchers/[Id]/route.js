import { VoucherModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"

export async function PUT(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await VoucherModel.findById(Id)

    if (!voucher) {
      return new Response(JSON.stringify({ error: "Voucher not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    voucher.isActive = !voucher.isActive
    await voucher.save()

    return new Response(JSON.stringify(voucher), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update voucher status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export async function GET(req, { params }) {
  const { Id } = params
  await mwdb()

  try {
    const voucher = await VoucherModel.findById(Id)

    if (!voucher) {
      return new Response(JSON.stringify({ error: "Voucher not found" }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(voucher), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to get voucher" }), {
      status: 500,
    })
  }
}
