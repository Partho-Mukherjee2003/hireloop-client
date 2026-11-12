// app/sign-in/page.tsx
"use client" // needed because we use useState and a form submit handler

import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"

const SignUpPage = () => {
  // Stores the error messages for each field (empty string = no error)
  const router = useRouter()
  const [serverError, setServerError] = useState("") // error from the server
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // true = show the password as text, false = hide it with dots
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // signUp Function
  const handleSignup = async (data:Record<string, string>) => {
    setIsLoading(true)
    setServerError("")
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/",
    })
setIsLoading(false)

if (error) {
  setServerError(error.message || "Something went wrong.")
  return
}

router.push("/")
  }

  // Runs when the form is submitted
  const handleSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // stop the page from reloading

    // 1. Get all the form data using FormData + Object.fromEntries
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData) as Record<string, string>
    const { name, email, password, confirmPassword } = data
    // console.log(data)
    // 2. Validate each field
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" }

    if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters."
    }

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

    // Check if both passwords are the same
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    // 3. Show the errors on the screen
    setErrors(newErrors)

    // 4. If any error exists, stop here
    const hasError = Object.values(newErrors).some((msg) => msg !== "")
    if (hasError) return

    // 5. Everything is valid. Send `data` to your backend here.
    // console.log("Form data:", data)

    //  Sign Up Function

    handleSignup(data);
  }

  // Runs when the Google button is clicked.
  // Add your Google sign in code inside this function.
  const handleGoogleSignIn = () => {
    // TODO: add Google sign in functionality here
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
        <h1 className="text-center text-3xl font-bold">Sign Up</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Create your HireLoop account and find your dream job.
        </p>

        {/* noValidate lets our own validation show the messages */}
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-gray-300">
              Name
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-indigo-500">
              <User size={18} className="text-gray-400" />
              <input
                id="name"
                name="name" // the "name" attribute is the key in FormData
                type="text"
                placeholder="Your full name"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-300">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-indigo-500">
              <Mail size={18} className="text-gray-400" />
              <input
                id="email"
                name="email"
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
                placeholder="At least 8 characters"
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

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm text-gray-300"
            >
              Confirm Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-indigo-500">
              <Lock size={18} className="text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              {/* Show / hide confirm password button */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit button */}
          {serverError && <p className="text-sm text-red-400">{serverError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-medium transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider with "or" text */}
        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google sign in button (type="button" so it does not submit the form) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
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
          Sign in with Google
        </button>
      </div>
    </main>
  )
}

export default SignUpPage
