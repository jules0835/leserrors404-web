import { company } from "@/assets/options/config"
import { getUserOtpDetails, updateUserOtpSecret } from "@/db/crud/userCrud"
import * as OTPAuth from "otpauth"
import QRCode from "qrcode"

export function verifyUserOtp(token, user) {
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

export async function getUserNewOtpKey(userId) {
  const { username } = await getUserOtpDetails(userId)
  const secret = generateSecret()
  const totp = new OTPAuth.TOTP({
    issuer: `${company.name}`,
    label: `${company.name} - ${username}`,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
  const uri = totp.toString()
  const qrCodeUrl = await QRCode.toDataURL(uri)

  await updateUserOtpSecret(userId, secret, false)

  return { secret, qrCodeUrl }
}

export function generateSecret() {
  const secret = new OTPAuth.Secret({ size: 20 })

  return secret.base32
}
