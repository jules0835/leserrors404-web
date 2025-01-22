/* eslint-disable max-lines-per-function */
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUserByEmail, createUser } from "@/db/crud/userCrud"
import * as yup from "yup"

const userSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  zipCode: yup.string().required("Zip code is required"),
  title: yup.number().required("Title is required"),
  company: yup.string().required("Company is required"),
})

export async function POST(req) {
  try {
    const requestBody = await req.json()

    await userSchema.validate(requestBody, { abortEarly: false })

    const {
      firstName,
      lastName,
      country,
      city,
      phone,
      email,
      password,
      zipCode,
      title,
      company,
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
      country,
      city,
      phone,
      email,
      password: hashedPassword,
      zipCode,
      title,
      company,
    })

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

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
