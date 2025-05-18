import { findUser, updateUser, existingEmail } from "@/db/crud/userCrud"
import { getEditUserSchema } from "@/features/auth/utils/userValidation"
import { getTranslations } from "next-intl/server"
import * as yup from "yup"
import { getReqUserId } from "@/features/auth/utils/getAuthParam"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { sendConfirmationEmail } from "@/features/auth/utils/accountService"
import { NextResponse } from "next/server"

export async function GET(req) {
  const userId = getReqUserId(req)

  try {
    const user = await findUser({ _id: userId })

    return Response.json(user)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch user profile",
      data: { userId },
      userId,
      isError: true,
    })

    return Response.json({ user: null }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const t = await getTranslations("User.Profile")
    const requestBody = await req.json()
    const userSchema = getEditUserSchema(t)
    await userSchema.validate(requestBody, { abortEarly: false })

    const {
      _id,
      firstName,
      lastName,
      phone,
      email,
      title,
      company,
      address: { country, city, zipCode, street },
      howDidYouHear,
    } = requestBody
    const user = await findUser({ _id })

    if (!user) {
      log.systemError({
        logKey: logKeys.userError.key,
        message: "User not found",
        data: { _id },
        userId: _id,
        isError: true,
      })

      return Response.json(
        {
          error: "UserNotFound",
          message: "User not found",
        },
        { status: 404 }
      )
    }

    if (email !== user.email) {
      const emailExists = await existingEmail(email)

      if (emailExists) {
        return NextResponse.json(
          {
            error: "EmailExists",
            message: t("emailExists"),
          },
          { status: 400 }
        )
      }

      updatedData.account = {
        ...user.account,
        confirmation: {
          ...user.account.confirmation,
          isConfirmed: false,
        },
      }
      await sendConfirmationEmail(_id)
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
      howDidYouHear,
    }
    const updatedUser = await updateUser(_id, updatedData)

    log.userInfo({
      logKey: logKeys.userEdit.key,
      message: "User profile updated",
      newData: updatedData,
      data: { userId: _id },
      userId: _id,
    })

    return Response.json({ success: true, user: updatedUser })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.inner.map((err) => err.message).join(", ")

      log.systemError({
        logKey: logKeys.userError.key,
        message: "Validation error",
        data: validationErrors,
        isError: true,
      })

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
      message: "Failed to update user profile",
      data: error.message,
      isError: true,
    })

    return Response.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
