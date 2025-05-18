import UserInbox from "@/features/user/support/inbox/userInbox"

export default function Page({ params }) {
  return (
    <div className="h-full">
      <UserInbox ticketId={params.Id} />
    </div>
  )
}
