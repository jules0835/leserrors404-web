import { NextResponse } from "next/server"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import { findUserById, deleteUserAddress } from "@/db/crud/userCrud"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function PUT(req, { params }) {
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

export async function DELETE(req, { params }) {
  try {
    const userId = getReqUserId(req)
    const { id } = params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await findUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const addressIndex = user.billingAddresses.findIndex(
      (address) => address._id.toString() === id
    )

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    await deleteUserAddress(userId, id)

    log.systemInfo({
      logKey: logKeys.userProfile.key,
      message: "Address deleted",
      authorId: userId,
      data: { addressId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    log.systemError({
      logKey: logKeys.userEdit.key,
      message: "Failed to delete address",
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
