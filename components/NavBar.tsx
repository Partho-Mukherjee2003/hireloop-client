"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import logo from "@/app/assets/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Links shown in the desktop bar and inside the mobile menu.
const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

// Shared styles for the plain text links.
const linkClass =
  "text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"

export default function NavBar() {
  // Controls the mobile dropdown panel.
  const [isOpen, setIsOpen] = useState(false)

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
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}

            {/* Divider before the auth actions */}
            <span className="h-5 w-px bg-white/20" aria-hidden="true" />

            <Link
              href="/sign-in"
              className={cn(linkClass, "text-indigo-400 hover:text-indigo-300")}
            >
              Sign In
            </Link>

            {/* Primary call to action */}
            <Link
              href="/get-started"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 rounded-xl bg-indigo-500 px-5 text-white hover:bg-indigo-400"
              )}
            >
              Get Started
            </Link>
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
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-white/5 hover:text-indigo-300"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>

              <Link
                href="/get-started"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-2 h-10 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-400"
                )}
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
