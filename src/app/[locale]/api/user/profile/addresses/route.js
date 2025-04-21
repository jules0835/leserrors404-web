import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findUserById, updateUser } from "@/db/crud/userCrud"

export async function GET(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await findUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const defaultAddress = {
      _id: "default",
      name: "Default",
      country: user.address.country,
      city: user.address.city,
      zipCode: user.address.zipCode,
      street: user.address.street,
      isDefault: true,
    }

    return NextResponse.json([defaultAddress, ...(user.billingAddresses || [])])
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const userId = getReqUserId(req)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const user = await updateUser(userId, {
      $push: {
        billingAddresses: {
          ...data,
          isDefault: false,
        },
      },
    })

    return NextResponse.json(user.billingAddresses)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
