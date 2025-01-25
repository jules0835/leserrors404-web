import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSideNavbar from "@/features/admin/layout/AdminSideNavbar"
import AdminTopNavbar from "@/features/admin/layout/AdminTopNavbar"
export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminSideNavbar />
      <SidebarInset>
        <AdminTopNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
