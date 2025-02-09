/* eslint-disable max-lines-per-function */
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByEmail, createUser } from "@/db/crud/userCrud"
import * as yup from "yup"
import { getRegisterSchema } from "@/utils/validation/user"
import { getTranslations } from "next-intl/server"

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
      return NextResponse.json(
        {
          error: "UserAlreadyExists",
          message: "User already exists with this email",
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await createUser({
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

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error(error)
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

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
