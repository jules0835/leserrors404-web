import { UserInboxProvider } from "@/features/user/support/inbox/context/userInboxContext"

export default function LayoutUserSupport({ children }) {
  return <UserInboxProvider>{children}</UserInboxProvider>
}
