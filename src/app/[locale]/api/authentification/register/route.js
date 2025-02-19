/* eslint-disable max-lines-per-function */
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByEmail, createUser } from "@/db/crud/userCrud"
import * as yup from "yup"
import { getRegisterSchema } from "@/features/auth/utils/userValidation"
import { getTranslations } from "next-intl/server"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"
import { sendConfirmationEmail } from "@/features/auth/utils/accountService"

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({ locale, namespace: "Auth.RegisterPage" })
    const requestBody = await req.json()
    const userSchema = getRegisterSchema(t)
    await userSchema.validate(requestBody, { abortEarly: false })

    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      title,
      company,
      howDidYouHear,
      address: { country, city, zipCode, street },
    } = requestBody

    if (await findUserByEmail(email)) {
      log.userError({
        message: `User try to register with email ${email} that already exists`,
        logKey: logKeys.registerFailed.key,
        data: { email },
      })

      return NextResponse.json(
        {
          error: "UserAlreadyExists",
          message: "User already exists with this email",
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await createUser({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      title,
      company,
      howDidYouHear,
      address: {
        country,
        city,
        zipCode,
        street,
      },
    })

    log.userInfo({
      message: `User with email ${email} successfully registered`,
      logKey: logKeys.registerSuccess.key,
      data: { email, userId: newUser._id },
      userId: newUser._id,
    })

    await sendConfirmationEmail(newUser._id)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.inner.map((err) => err.message).join(", ")

      return NextResponse.json(
        {
          error: "ValidationError",
          message: validationErrors,
        },
        { status: 400 }
      )
    }

    log.systemError({
      message: "Failed to register user",
      logKey: logKeys.registerFailed.key,
      isError: true,
      technicalMessage: error.message,
      data: error,
    })

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
