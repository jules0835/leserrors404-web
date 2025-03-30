import { AdminChatProvider } from "@/features/admin/support/context/adminChatContext"

export default function AdminSupportLayout({ children }) {
  return <AdminChatProvider>{children}</AdminChatProvider>
}
