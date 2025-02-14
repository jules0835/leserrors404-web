import {
  changeActiveUserStatus,
  changeUserConfirmedStatus,
  findUserForAdmin,
  findUser,
  updateUser,
} from "@/db/crud/userCrud"
import * as yup from "yup"
import { getEditUserSchema } from "@/features/auth/utils/userValidation"
import { getTranslations } from "next-intl/server"
import bcrypt from "bcryptjs"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"

export async function POST(req, { params }) {
  const { searchParams } = req.nextUrl
  const action = searchParams.get("action") || null
  const actionValue = searchParams.get("value") || null
  const userId = await params.Id

  if (action === null || actionValue === null) {
    log.systemSecurity({
      logKey: logKeys.systemInfo.key,
      message: "Invalid request in /{locale}/api/admin/security/users/[Id]",
      data: { action, actionValue },
      isAdminAction: getReqIsAdmin(req),
      userId: getReqUserId(req),
      isError: true,
    })

    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  if (action === "changeStatus") {
    try {
      const updatedUser = await changeActiveUserStatus(
        userId,
        actionValue === "true"
      )
      log.userInfo({
        logKey: logKeys.userEdit.key,
        message: `User status changed to ${actionValue} by admin`,
        newData: { actionValue },
        data: { userId, actionValue },
        isAdminAction: getReqIsAdmin(req),
        userId: getReqUserId(req),
      })

      return Response.json({ success: true, user: updatedUser })
    } catch (error) {
      log.systemInfo({
        logKey: logKeys.internalError.key,
        message: "Failed to change user status",
        data: { userId, actionValue },
        isAdminAction: getReqIsAdmin(req),
        userId: getReqUserId(req),
        isError: true,
      })

      return Response.json(
        { error: "Failed to change user status" },
        { status: 500 }
      )
    }
  }

  if (action === "changeConfirmed") {
    try {
      const updatedUser = await changeUserConfirmedStatus(
        userId,
        actionValue === "true"
      )

      log.userInfo({
        logKey: logKeys.userEdit.key,
        message: `User confirmed status changed to ${actionValue} by admin`,
        newData: { actionValue },
        data: { userId, actionValue },
        isAdminAction: getReqIsAdmin(req),
        userId: getReqUserId(req),
      })

      return Response.json({ success: true, user: updatedUser })
    } catch (error) {
      log.systemInfo({
        logKey: logKeys.internalError.key,
        message: "Failed to change user confirmed status",
        data: { userId, actionValue },
        isAdminAction: getReqIsAdmin(req),
        userId: getReqUserId(req),
        isError: true,
      })

      return Response.json(
        { error: "Failed to change user confirmed status" },
        { status: 500 }
      )
    }
  }

  log.systemSecurity({
    logKey: logKeys.systemInfo.key,
    message: "Invalid request in /{locale}/api/admin/security/users/[Id]",
    data: { action, actionValue },
    isAdminAction: getReqIsAdmin(req),
    userId: getReqUserId(req),
  })

  return Response.json({ error: "Invalid request" }, { status: 400 })
}

export async function GET(req, { params }) {
  const userId = await params.Id

  try {
    const user = await findUserForAdmin(userId)

    return Response.json({ user })
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to get user",
      data: { userId },
      isAdminAction: getReqIsAdmin(req),
      userId: getReqUserId(req),
      isError: true,
    })

    return Response.json({ user: null })
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({
      locale,
      namespace: "Admin.Security.Users.UserDetails",
    })
    const requestBody = await req.json()
    const userSchema = getEditUserSchema(t)
    await userSchema.validate(requestBody, { abortEarly: false })

    const {
      _id,
      firstName,
      lastName,
      phone,
      email,
      password,
      title,
      company,
      address: { country, city, zipCode, street },
      isActive,
      isEmployee,
      isAdmin,
      isConfirmed,
      howDidYouHear,
    } = requestBody
    const user = await findUser({ _id })

    if (!user) {
      return Response.json(
        {
          error: "UserNotFound",
          message: "User not found",
        },
        { status: 404 }
      )
    }

    const updatedData = {
      firstName,
      lastName,
      phone,
      email,
      title,
      company,
      address: {
        country,
        city,
        zipCode,
        street,
      },
      isActive,
      isEmployee,
      isAdmin,
      isConfirmed,
      howDidYouHear,
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await updateUser(_id, updatedData)

    log.userInfo({
      logKey: logKeys.userEdit.key,
      message: "User updated by admin",
      newData: updatedData,
      data: { userId: _id },
      isAdminAction: getReqIsAdmin(req),
      userId: getReqUserId(req),
    })

    return Response.json({ success: true, user: updatedUser })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.inner.map((err) => err.message).join(", ")

      return Response.json(
        {
          error: "ValidationError",
          message: validationErrors,
        },
        { status: 400 }
      )
    }

    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to update user",
      data: error.message,
      isAdminAction: getReqIsAdmin(req),
      userId: getReqUserId(req),
      isError: true,
    })

    return Response.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
