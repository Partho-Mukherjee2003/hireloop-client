// components/DashboardSidebar.tsx
"use client" // needed because we use hooks (useSession, usePathname)

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  Banknote,
  Settings,
  Users,
  Building2,
  LogOut,
  type LucideIcon,
} from "lucide-react"

import logo from "@/app/assets/logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"

// The 3 roles (same values as in your lib/auth.ts file)
type Role = "seeker" | "recruiter" | "admin"

// One menu item: a name, a link and an icon
type MenuItem = { name: string; url: string; icon: LucideIcon }

// ===== The menu for each role. Add or remove items here. =====
const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", url: "/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/saved-jobs", icon: Bookmark },
    { name: "Applications", url: "/dashboard/applications", icon: FileText },
    { name: "Billing", url: "/dashboard/billing", icon: Banknote },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Jobs", url: "/dashboard/manage-jobs", icon: Briefcase },
    { name: "Applications", url: "/dashboard/applications", icon: FileText },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", url: "/dashboard/manage-users", icon: Users },
    { name: "Manage Jobs", url: "/dashboard/manage-jobs", icon: Briefcase },
    { name: "Companies", url: "/dashboard/companies", icon: Building2 },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
}

// The text shown under the user's name
const roleLabels: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

const DashboardSidebar = () => {
  const router = useRouter()
  const pathname = usePathname() // current page, for example "/dashboard/applications"

  // Use authClient.useSession (it knows about the "role" field)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const role = (user?.role ?? "seeker") as Role

  // A menu item is active when we are on its page.
  // "/dashboard" must match exactly, or it would be active on every dashboard page.
  const isActive = (url: string) =>
    url === "/dashboard"
      ? pathname === url
      : pathname === url || pathname.startsWith(url + "/")

  // Log out, then go to the home page
  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    // The inner part of the sidebar is made black to match the design
    <Sidebar className="border-white/10 [&_[data-slot=sidebar-inner]]:bg-black">
      {/* ---------- Top: logo and profile card ---------- */}
      <SidebarHeader className="gap-4 p-4">
        <Link href="/" aria-label="HireLoop home">
          <Image src={logo} alt="HireLoop" className="h-9 w-auto" />
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          {/* Profile picture. If there is none, show the first letter of the name */}
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name}
            </p>
            <span className="mt-0.5 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-300">
              {roleLabels[role]}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ---------- Middle: menu for the user's role ---------- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Wait until we know the role, so the wrong menu never flashes */}
            {!isPending &&
              menuItemsByRole[role].map((item) => (
                <SidebarMenuItem key={item.name}>
                  {/* Small indigo bar on the left of the active item */}
                  {isActive(item.url) && (
                    <span className="absolute top-1/2 -left-2 h-5 w-0.5 -translate-y-1/2 rounded bg-indigo-500" />
                  )}

                  {/* render={<Link />} makes the button a Link (new shadcn uses "render", not "asChild") */}
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive(item.url)}
                    className="text-white/60 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------- Bottom: Post Resume (seeker only) and Logout ---------- */}
      <SidebarFooter className="gap-2 p-4">
        {role === "seeker" && (
          <Link
            href="/dashboard/post-resume"
            className="rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Post Resume
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSidebar
