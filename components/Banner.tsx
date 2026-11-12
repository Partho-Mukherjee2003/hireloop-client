// components/Banner.tsx
// Install the icons first:  npm install lucide-react

import Image from "next/image"
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  Users,
  Star,
} from "lucide-react"
import globe from "@/app/assets/globe.png" // background globe image

// Trending job chips shown under the search bar
const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

// Data for the 4 stat cards at the bottom
const stats = [
  { icon: BriefcaseBusiness, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

export default function Banner() {
  return (
    // Main wrapper: one black background for the whole top area.
    // The navbar is "fixed", so it floats on top of this background.
    <section className="relative overflow-hidden bg-black text-white">
      {/* ---------- Background globe image ---------- */}
      {/* A box with a FIXED height, stuck to the bottom of the section.
          Because the height is fixed, the globe stays visible on every screen size
          (the image is only cropped, never pushed out of the section).
          Bigger height = globe goes up, smaller = globe goes down. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] sm:h-[480px] lg:h-[560px]">
        <Image
          src={globe}
          alt="Globe background"
          fill
          priority
          sizes="100vw"
          // object-cover fills the box. No mask here, so the purple glow
          // around the globe stays fully visible like the design.
          className="object-cover object-center"
        />
      </div>

      {/* ---------- Content (sits above the image) ---------- */}
      {/* pt-32 leaves space for the fixed navbar */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-32 pb-10 sm:px-6 md:pt-40">
        {/* Top badge */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs">
          <span>💼</span>
          <span className="font-mono tracking-wide text-gray-300">
            <b className="text-white">50,000+</b> NEW JOBS THIS MONTH
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-center text-4xl font-bold sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>

        {/* Sub text */}
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-gray-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* ---------- Search bar ---------- */}
        {/* Stacks vertically on mobile, one row on tablet/desktop */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur sm:flex-row sm:items-center">
          {/* Job input */}
          <div className="flex flex-1 items-center gap-2 px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Job title, skill or company"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Divider (only visible on larger screens) */}
          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          {/* Location input */}
          <div className="flex flex-1 items-center gap-2 px-3 py-2">
            <MapPin size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Location or Remote"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
            />
          </div>

          {/* Search button */}
          <button
            type="button"
            className="flex items-center justify-center rounded-xl bg-indigo-500 p-3 transition hover:bg-indigo-600"
          >
            <Search size={18} />
          </button>
        </div>

        {/* ---------- Trending positions ---------- */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-gray-400">Trending Position</span>
          {trending.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-gray-200"
            >
              {item}
            </span>
          ))}
        </div>

        {/* ---------- Text over the globe ---------- */}
        {/* The top margin leaves space so the globe is visible */}
        <h2 className="mx-auto mt-36 max-w-md text-center text-2xl font-light text-gray-300 sm:mt-44 sm:text-3xl md:mt-56">
          Assisting over{" "}
          <b className="font-semibold text-white">15,000 job seekers</b> find
          their dream positions.
        </h2>

        {/* ---------- Stat cards ---------- */}
        {/* 2 columns on mobile, 4 columns on desktop */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/60 p-5 backdrop-blur"
            >
              <Icon size={18} className="text-gray-300" />
              <p className="mt-6 text-3xl font-semibold sm:text-4xl">{value}</p>
              <p className="mt-1 text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
