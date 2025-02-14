import { headers } from "next/headers"

export function getReqUserId() {
  const headersList = headers()
  const intAuth = headersList.get("x-int-auth-userId")

  if (!intAuth) {
    return null
  }

  const userId = intAuth

  return userId
}

export function getReqIsAdmin() {
  const headersList = headers()
  const intAuth = headersList.get("x-int-auth-isAdmin")

  if (!intAuth) {
    return false
  }

  const isAdmin = intAuth === "true"

  return isAdmin
}
