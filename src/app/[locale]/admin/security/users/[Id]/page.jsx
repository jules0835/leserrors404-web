import { UserDetailsForm } from "@/features/admin/security/users/UserDetails"
import { findUserForAdmin } from "@/db/crud/userCrud"

export default async function UserPage({ params }) {
  const { user } = await findUserForAdmin(params.Id)

  if (!user) {
    return <div>User not found</div>
  }

  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <div>
      <UserDetailsForm user={plainUser} />
    </div>
  )
}
