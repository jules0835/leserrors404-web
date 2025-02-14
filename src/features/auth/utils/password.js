/* eslint-disable no-console */
import bcrypt from "bcrypt"

async function hashPassword(password) {
  try {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error)
    throw error
  }
}

export default hashPassword
