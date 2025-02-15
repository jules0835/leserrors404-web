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

export const changeActiveUserStatus = async (userId, status) => {
  await mwdb()
  await UserModel.updateOne({ _id: userId }, { isActive: status })
  const updatedUser = await UserModel.findById(userId).select("-password")

  return updatedUser
}

export const changeUserConfirmedStatus = async (userId, status) => {
  await mwdb()
  await UserModel.updateOne({ _id: userId }, { isConfirmed: status })
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
