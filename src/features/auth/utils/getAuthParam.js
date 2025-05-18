export function getReqUserId(req) {
  const intAuth = req.headers.get("x-int-auth-userId")

  if (!intAuth || intAuth === "undefined" || intAuth === "null") {
    return null
  }

  const userId = intAuth

  return userId
}

export function getReqIsAdmin(req) {
  const intAuth = req.headers.get("x-int-auth-isAdmin")

  if (!intAuth || intAuth === "undefined" || intAuth === "null") {
    return false
  }

  const isAdmin = intAuth === "true"

  return isAdmin
}
