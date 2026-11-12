// components/NavBar.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // NEW: usePathname (active link), useRouter (after logout)
import { Menu, X, LogOut } from "lucide-react"
import logo from "@/app/assets/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

// Links shown in the desktop bar and inside the mobile menu.
const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

export default function NavBar() {
  // Controls the mobile dropdown panel.
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  // NEW: the current page path, for example "/jobs"
  const pathname = usePathname()

  // session.user is the logged in user. isPending is true while it is loading.
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  // NEW: a link is "active" when we are on that page (or a page inside it)
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  // NEW: log the user out, then go to the home page
  const handleLogout = async () => {
    await authClient.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  // NEW: profile picture. If the user has no picture, show the first letter of the name.
  const avatar = user?.image ? (
    // A normal <img> is used because Google pictures come from another website
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.image}
      alt={user.name}
      referrerPolicy="no-referrer"
      className="h-9 w-9 rounded-full border border-indigo-500/50 object-cover"
    />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-4 py-4">
      {/* Floating dark navbar shell */}
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#17171a]/95 shadow-lg backdrop-blur-md">
        <nav className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" aria-label="HireLoop home" className="shrink-0">
            <Image src={logo} alt="HireLoop" className="h-10 w-auto" preload />
          </Link>

          {/* Desktop navigation: hidden below md */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // NEW: active link is white with an indigo line under it
                className={cn(
                  "border-b-2 py-1 text-sm font-medium transition-colors hover:text-white",
                  isActive(link.href)
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-white/70"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider before the auth actions */}
            <span className="h-5 w-px bg-white/20" aria-hidden="true" />

            {/* Show nothing while we are checking if the user is logged in */}
            {isPending ? null : user ? (
              // ===== NEW: logged in -> picture, name and logout button =====
              <div className="flex items-center gap-3">
                {avatar}
                <span className="max-w-[120px] truncate text-sm font-medium text-white">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              // ===== Logged out -> Sign In and Get Started =====
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Sign In
                </Link>

                {/* Primary call to action */}
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-10 rounded-xl bg-indigo-500 px-5 text-white hover:bg-indigo-400"
                  )}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </nav>

        {/* Mobile dropdown panel */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="animate-in border-t border-white/10 px-4 pt-2 pb-4 duration-200 fade-in-0 slide-in-from-top-2 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // NEW: active link has an indigo background
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white",
                    isActive(link.href)
                      ? "bg-indigo-500/20 text-white"
                      : "text-white/70"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isPending ? null : user ? (
                // ===== NEW: logged in (mobile) =====
                <>
                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
                    {avatar}
                    <span className="truncate text-sm font-medium text-white">
                      {user.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                // ===== Logged out (mobile) =====
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-white/5 hover:text-indigo-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-2 h-10 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-400"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
