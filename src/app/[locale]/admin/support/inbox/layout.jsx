"use client"

import AdminInboxSidebar from "@/features/admin/support/inbox/adminInboxSidebar"

export default function AdminInboxLayout({ children }) {
  return (
    <div className="flex flex-1 overflow-hidden h-full">
      <AdminInboxSidebar />
      {children}
    </div>
  )
}
