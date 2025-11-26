"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"

interface SocialButtonProps {
  icon: React.ReactNode
  text: string
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text }) => (
  <button className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
    {icon}
    <span className="ml-2">{text}</span>
  </button>
)

export default function SigninPage() {
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, isLoading } = useAuth()

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setEmailSubmitted(true)
      setError("")
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push("/rentals")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    }
  }

  const googleIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.94 12.285c0-.987-.087-1.95-.246-2.887H12v5.477h6.436c-.279 1.385-1.096 2.57-2.316 3.486v4.38h5.642c3.308-3.05 5.228-7.53 5.228-12.016z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.955-1.077 7.94-2.923l-5.642-4.38c-1.554 1.04-3.535 1.657-5.32 1.657-4.108 0-7.59-2.793-8.835-6.577H1.52v4.527C3.593 21.05 7.42 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M3.165 14.577c-.247-.73-.39-1.503-.39-2.285s.143-1.555.39-2.285V5.485H1.52c-.886 1.764-1.35 3.79-1.35 5.928s.464 4.164 1.35 5.928l1.645-4.76z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.715c2.213 0 4.19.82 5.73 2.215L21.36 3.65C19.167 1.41 15.82 0 12 0 7.42 0 3.593 2.95 1.52 7.072l1.645 4.76c1.245-3.784 4.727-6.577 8.835-6.577z"
        fill="#EA4335"
      />
    </svg>
  )
  const appleIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.51 11.02c.03-1.89-.92-3.69-2.58-4.78-1.55-1.02-3.78-1.24-5.37-.23-1.63 1.05-2.59 2.87-2.67 4.79-.06 1.31.33 2.68.99 3.93.9 1.72 1.94 3.49 3.53 3.46 1.59-.03 2.37-1.31 3.94-1.31 1.57 0 2.39 1.31 3.93 1.28 1.56-.03 2.6-1.77 3.49-3.48.66-1.25 1.05-2.62.99-3.93zM15.53 2.84c.83-.98 1.48-2.23 1.36-3.84-.96.06-2.14.73-3.15 1.76-1.07 1.05-1.73 2.45-1.58 3.96 1.05.03 2.22-.64 3.37-1.88z" />
    </svg>
  )
  const facebookIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.496V14.67H9.274V10.237h3.547V7.072c0-3.51 2.12-5.422 5.257-5.422 1.49 0 2.76.11 3.13.16v3.62h-2.15c-1.69 0-2.02.81-2.02 1.99v2.66h4.03l-.64 4.43h-3.39V24h6.052c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
    </svg>
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-4">
            {/* <span className="text-3xl font-bold text-blue-600">Zillow</span> */}
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form className="space-y-4" onSubmit={emailSubmitted ? handleSignIn : handleEmailContinue}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailSubmitted}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {emailSubmitted && (
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-xs font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isLoading ? "Loading..." : emailSubmitted ? "Sign in" : "Continue"}
            </button>

            {emailSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setEmailSubmitted(false)
                  setPassword("")
                  setError("")
                }}
                className="w-full text-blue-600 font-semibold hover:text-blue-700 py-2 text-sm"
              >
                Back
              </button>
            )}
          </form>

          {!emailSubmitted && (
            <>
              <p className="pt-3 text-xs sm:text-sm text-gray-700">
                New to Zillow?{" "}
                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                  Create account
                </Link>
              </p>

              <div className="flex items-center space-x-3 my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs font-medium text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="space-y-2">
                <SocialButton icon={googleIcon} text="Continue with Google" />
                <SocialButton icon={appleIcon} text="Continue with Apple" />
                <SocialButton icon={facebookIcon} text="Continue with Facebook" />
              </div>

              <p className="pt-2 text-xs text-gray-500">
                By submitting, I accept Zillow's{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  terms of use
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-gray-100 relative overflow-hidden">
        <img
          src="/signin-image.jpg"
          alt="Family enjoying time in front of their home"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}