import { UserModel } from "@/db/models/UserModel"
import { mwdb } from "@/api/mwdb"

export const existingUsername = async (username) => {
  await mwdb()

  const existingUsernameRes = await UserModel.findOne({ username })

  return Boolean(existingUsernameRes)
}

export const existingEmail = async (email) => {
  await mwdb()

  const existingEmailRes = await UserModel.findOne({ email })

  return Boolean(existingEmailRes)
}

export const findUser = async (query) => {
  await mwdb()

  const user = await UserModel.findOne(query)

  return user
}

export const findUserSignUp = async (email) => {
  await mwdb()

  const user = await UserModel.findOne({ email })

  return user
}

export const findAuthUser = async (email) => {
  await mwdb()

  const user = await UserModel.findOne({ email })

  console.log("user", user)
  return user || null
}

export const findUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email })

  return user
}

export const createUser = async (user) => await UserModel.create(user)
