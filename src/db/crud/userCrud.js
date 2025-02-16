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

  return user || null
}

export const findUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email })

  return user
}

export const createUser = async (user) => await UserModel.create(user)

export const getUsers = async (size = 10, page = 1, query = "") => {
  try {
    await mwdb()
    const searchQuery = query
      ? {
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
      : {}
    const total = await UserModel.countDocuments(searchQuery)
    const users = await UserModel.find(searchQuery)
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
    console.log("Adding login attempt")
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
