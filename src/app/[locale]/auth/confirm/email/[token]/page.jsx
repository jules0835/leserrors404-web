import { confirmEmailWithToken } from "@/features/auth/utils/accountService"

export default async function Page({ params }) {
  const { token } = await params
  const confirmResult = await confirmEmailWithToken(token)

  if (!confirmResult) {
    return <div>Failed to confirm email</div>
  }

  if (confirmResult) {
    return <div>Email confirmed</div>
  }
}
