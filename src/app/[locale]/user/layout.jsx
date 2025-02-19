"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import UserSidebar from "@/features/user/layout/userSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function UserLayout({ children }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
          <div className="mt-16">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  )
}
