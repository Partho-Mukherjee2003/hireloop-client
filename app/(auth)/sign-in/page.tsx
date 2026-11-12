// app/login/page.tsx
"use client" // needed because we use useState and a form submit handler

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Stores the error message for each field (empty string = no error)
  const [errors, setErrors] = useState({ email: "", password: "" })

  // true = show the password as text, false = hide it with dots
  const [showPassword, setShowPassword] = useState(false)

  // Runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // stop the page from reloading

    // 1. Get the form data using FormData + Object.fromEntries
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData) as Record<string, string>
    const { email, password } = data
    // console.log(data)
    // 2. Validate the fields
    const newErrors = { email: "", password: "" }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    // Password rules: 8+ characters, at least one letter and one number
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password =
        "Password must have at least one letter and one number."
    }

    // 3. Show the errors on the screen
    setErrors(newErrors)

    // 4. If any error exists, stop here
    const hasError = Object.values(newErrors).some((msg) => msg !== "")
    if (hasError) return

    // 5. Everything is valid. Send `data` to your backend here.
    // console.log("Login data:", data)
    setIsLoading(true)
    setServerError("")
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    })
    setIsLoading(false)

    // If login failed, show the message and stop
    if (error) {
      setServerError(error.message || "Invalid email or password.")
      return
    }

    // Login worked, go to the home page
    router.push("/")
    router.refresh()
  }

  // Runs when the Google button is clicked.
  // Add your Google sign in code inside this function.
  const handleGoogleLogin = () => {
    // TODO: add Google login functionality here
  }

  return (
    // Full-screen black page. pt-28 leaves space for the fixed navbar.
    <main className="flex min-h-screen items-center justify-center bg-black px-4 pt-28 pb-10 text-white">
      {/* Card with a purple glow coming from the form itself:
          - bg-gradient: purple light inside the card (same color as the globe)
          - border-indigo-500/30: soft glowing border
          - shadow-[...]: purple light spreading outside the card
          Make the last number (0.6) bigger for a stronger glow. */}
      <div className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/25 via-indigo-950/40 to-black/80 p-6 shadow-[0_0_90px_-10px_rgba(99,102,241,0.6)] backdrop-blur sm:p-8">
        {/* Heading */}
        <h1 className="text-center text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Log in to your HireLoop account.
        </p>

        {/* noValidate lets our own validation show the messages */}
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-300">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-indigo-500">
              <Mail size={18} className="text-gray-400" />
              <input
                id="email"
                name="email" // the "name" attribute is the key in FormData
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-gray-300"
            >
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-indigo-500">
              <Lock size={18} className="text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // changes with the toggle
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              {/* Show / hide password button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          {serverError && <p className="text-sm text-red-400">{serverError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-medium transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Divider with "or" text */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google button (type="button" so it does not submit the form) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10"
        >
          {/* Google logo */}
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Link to the other form */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
