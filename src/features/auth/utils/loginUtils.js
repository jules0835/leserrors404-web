import * as OTPAuth from "otpauth"
import { company } from "@/assets/options/config"

export const handleAuthLoginFailure = async (userId) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/en/api/services/account?action=handleLoginFailure`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
export const handleAuthLoginSuccess = async (userId) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/en/api/services/account?action=handleLoginSuccess`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
export const sendAuthConfirmationEmail = async (userId) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/en/api/services/account?action=sendConfirmationEmail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({ userId }),
    }
  )
}
export const verifyAuthUserOtp = (token, user) => {
  try {
    const username = `${user.firstName} ${user.lastName}`
    const userSecret = user.account.auth.otpSecret

    if (!username || !userSecret) {
      return { valid: false, message: "Invalid user data" }
    }

    const totp = new OTPAuth.TOTP({
      issuer: `${company.name}`,
      label: `${company.name} - ${username}`,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(userSecret),
    })
    const delta = totp.validate({ token, window: 1 })

    return delta !== null
  } catch (error) {
    return false
  }
}
