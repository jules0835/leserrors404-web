/* eslint-disable max-params */
import { UserModel } from "@/db/models/indexModels"
import { mwdb } from "@/api/mwdb"
import { getUserOrderEligibilitySchema } from "@/features/auth/utils/userValidation"

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

  return user || null
}

export const findUserByEmail = async (email) => {
  await mwdb()
  const user = await UserModel.findOne({ email })

  return user
}

export const createUser = async (user) => await UserModel.create(user)

export const getUsers = async (
  size = 10,
  page = 1,
  query = "",
  sort = { createdAt: -1 }
) => {
  try {
    await mwdb()
    let searchQuery = {}

    if (typeof query === "string" && query) {
      searchQuery = {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { zipCode: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }
    }

    const total = await UserModel.countDocuments(searchQuery)
    const users = await UserModel.find(searchQuery)
      .sort(sort)
      .limit(size)
      .skip(size * (page - 1))
      .select("-password")

    return { users, total }
  } catch (error) {
    return { users: [], total: 0 }
  }
}

export const changeActiveUserStatus = async (userId, status, reason = null) => {
  await mwdb()
  await UserModel.updateOne(
    { _id: userId },
    {
      "account.activation.isActivated": status,
      "account.activation.inactivationReason": reason,
      "account.activation.inactivationDate": status ? null : new Date(),
    }
  )
  const updatedUser = await UserModel.findById(userId).select("-password")

  return updatedUser
}

export const changeUserConfirmedStatus = async (userId, status) => {
  await mwdb()
  await UserModel.updateOne(
    { _id: userId },
    { "account.confirmation.isConfirmed": status }
  )
  const updatedUser = await UserModel.findById(userId).select("-password")

  return updatedUser
}

export const findUserForAdmin = async (id) => {
  await mwdb()

  try {
    const user = await UserModel.findOne({ _id: id }).select("-password")

    return { user }
  } catch (error) {
    return { user: null }
  }
}

export const updateUser = async (id, data) => {
  await mwdb()

  const user = await UserModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
  }).select("-password")

  return user
}

export const findUserEmailInfos = async (id) => {
  await mwdb()
  const user = await UserModel.findById(id).select(
    "email firstName lastName phone"
  )

  return user
}

export const addLoginAttempt = async (userId) => {
  await mwdb()

  try {
    await UserModel.updateOne(
      { _id: userId },
      { $inc: { "account.auth.loginAttempts": 1 } }
    )
  } catch (error) {
    throw new Error("Failed to add login attempt")
  }
}

export const resetLoginAttempts = async (userId) => {
  await mwdb()
  await UserModel.updateOne(
    { _id: userId },
    { "account.auth.loginAttempts": 0 }
  )
}

export const findUserById = async (id) => {
  await mwdb()
  const user = await UserModel.findById(id)

  return user
}

export const updateConfirmationToken = async (userId, token, expiresToken) => {
  await mwdb()

  try {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        "account.confirmation.token": token,
        "account.confirmation.expiresToken": expiresToken,
        "account.confirmation.lastSendTokenDate": new Date(),
      }
    )
  } catch (error) {
    throw new Error("Failed to update confirmation token")
  }
}

export const updateUserResetToken = async (userId, token, expires) => {
  await mwdb()

  try {
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        "account.resetPassword.token": token,
        "account.resetPassword.expires": expires,
      }
    )
  } catch (error) {
    throw new Error("Failed to update reset token")
  }
}

export const findUserByConfirmationToken = async (token) => {
  await mwdb()

  try {
    if (!token) {
      return null
    }

    const user = await UserModel.findOne({
      "account.confirmation.token": token,
    })

    return user || null
  } catch (error) {
    throw new Error("Failed to find user by confirmation token")
  }
}

export async function getOtpSecret(userId) {
  await mwdb()

  const user = await UserModel.findById(userId).select(
    "firstName lastName account.auth.otpSecret"
  )

  if (!user) {
    return { username: null, userSecret: null }
  }

  const username = `${user.firstName} ${user.lastName}`
  const userSecret = user.account.auth.otpSecret

  return { username, userSecret }
}

export async function getUserOtpDetails(userId) {
  await mwdb()

  const user = await UserModel.findById(userId).select(
    "firstName lastName account.auth.isOtpEnabled"
  )
  const username = `${user.firstName} ${user.lastName}`
  const { isOtpEnabled } = user.account.auth

  return { username, isOtpEnabled }
}

export async function updateUserOtpSecret(userId, secret, active) {
  await mwdb()

  await UserModel.updateOne(
    { _id: userId },
    { "account.auth.otpSecret": secret, "account.auth.isOtpEnabled": active }
  )
}

export async function changeStatusUserOtp(userId, active) {
  await mwdb()

  await UserModel.updateOne(
    { _id: userId },
    { "account.auth.isOtpEnabled": active }
  )
}

export async function updateUserPassword(userId, password) {
  await mwdb()

  await UserModel.updateOne({ _id: userId }, { password })
}

export async function checkResetToken(token) {
  await mwdb()

  const user = await UserModel.findOne({
    "account.resetPassword.token": token,
    "account.resetPassword.expires": { $gt: new Date() },
  })

  return Boolean(user)
}

export async function findUserByResetToken(token) {
  await mwdb()

  const user = await UserModel.findOne({
    "account.resetPassword.token": token,
  }).select("-password")

  return user
}

export const checkUserOrderEligibility = async (userId) => {
  await mwdb()

  const user = await UserModel.findById(userId)

  try {
    await getUserOrderEligibilitySchema().validate(user)
  } catch (error) {
    return { isEligible: false }
  }

  return { isEligible: true }
}

export const getUserIdByEmail = async (email) => {
  await mwdb()
  const user = await UserModel.findOne({ email })

  return user._id
}

export const findUserByStripeId = async (stripeId) => {
  await mwdb()
  const user = await UserModel.findOne({
    "account.stripe.customerId": stripeId,
  })

  return user
}

export const getTodayRegistrationsCount = async () => {
  await mwdb()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await UserModel.countDocuments({
    createdAt: { $gte: today },
  })
}
