import bcrypt from "bcrypt"

async function hashPassword(password) {
  try {
    // Génère un salt avec 10 rounds (ajuste selon ton besoin)
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Retourne le mot de passe haché
    return hashedPassword
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error)
    throw error
  }
}

export default hashPassword
