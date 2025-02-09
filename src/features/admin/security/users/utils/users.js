import { getUsers } from "@/db/crud/userCrud"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"

export async function getUsersList(size = 10, page = 1, query = "") {
  try {
    const { users, total } = await getUsers(size, page, query)

    return { users, total }
  } catch (error) {
    return { users: [], total: 0 }
  }
}

export const useChangeActiveUserStatus = () => {
  const t = useTranslations("Admin.Security.Users")

  return useMutation({
    mutationFn: async ({ userId, status }) => {
      const response = await toast.promise(
        fetch(
          `/api/admin/security/users/${userId}?action=changeStatus&value=${status}`,
          {
            method: "POST",
          }
        ).then((res) => {
          if (!res.ok) {
            throw new Error(t("failedToChangeUserStatus"))
          }

          return res
        }),
        {
          loading: t("changingUserStatus", {
            status: status ? t("active") : t("inactive"),
          }),
          success: t("userStatusChanged", {
            status: status ? t("active") : t("inactive"),
          }),
          error: t("failedToChangeUserStatus"),
        }
      )
      const userResponse = await response.json()

      return userResponse.user
    },
  })
}

export const useChangeConfirmedUserStatus = () => {
  const t = useTranslations("Admin.Security.Users")

  return useMutation({
    mutationFn: async ({ userId, status }) => {
      const response = await toast.promise(
        fetch(
          `/api/admin/security/users/${userId}?action=changeConfirmed&value=${status}`,
          {
            method: "POST",
          }
        ).then((res) => {
          if (!res.ok) {
            throw new Error(t("failedToChangeUserStatus"))
          }

          return res
        }),
        {
          loading: t("changingUserStatus", {
            status: status ? t("confirmed") : t("unconfirmed"),
          }),
          success: t("userStatusChanged", {
            status: status ? t("confirmed") : t("unconfirmed"),
          }),
          error: t("failedToChangeUserStatus"),
        }
      )
      const userResponse = await response.json()

      return userResponse.user
    },
  })
}
