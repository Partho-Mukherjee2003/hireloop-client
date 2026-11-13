// app/dashboard/layout.tsx
// This layout wraps EVERY page inside the dashboard folder.
import DashboardSidebar from "@/app/Components/DashboardSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // SidebarProvider is a flex row: [sidebar] [page content]
    <SidebarProvider>
      <DashboardSidebar />

      {/* SidebarInset is the page area. It fills all the space that is left. */}
      <SidebarInset className="bg-black text-white">
        {/* Top bar with the menu button. Only on mobile (hidden on md and bigger),
            so there is no empty space at the top on big screens. */}
        <header className="flex h-12 items-center border-b border-white/10 px-4 md:hidden">
          <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
        </header>

        {/* The page (for example the "Post a New Job" form) is shown here */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
