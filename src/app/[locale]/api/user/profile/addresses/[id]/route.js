import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findUserById } from "@/db/crud/userCrud"

export async function PUT(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const { id } = params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const user = await findUserById(userId)
    const addressIndex = user.billingAddresses.findIndex(
      (addr) => addr._id.toString() === id
    )

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    user.billingAddresses[addressIndex] = {
      ...user.billingAddresses[addressIndex],
      ...data,
    }

    await user.save()

    return NextResponse.json(user.billingAddresses)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const { id } = params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await findUserById(userId)
    const addressIndex = user.billingAddresses.findIndex(
      (addr) => addr._id.toString() === id
    )

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    user.billingAddresses.splice(addressIndex, 1)
    await user.save()

    return NextResponse.json(user.billingAddresses)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
