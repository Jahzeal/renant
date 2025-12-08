"use client";

import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // Your Zustand store hook
import SocialButton from "@/components/SocialButton";

// ... SocialButton Component (assumed structure) ...

export default function SigninPage() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState("");
  const router = useRouter();

  // 1. 🟢 FIX: Call the base hook at the top level
  const store = useAuth();

  // 2. 🟢 FIX: Use useMemo to select and stabilize only the required values/actions
  const { signIn, isLoading, authError } = React.useMemo(
    () => ({
      signIn: store.signIn,
      isLoading: store.isLoading,
      authError: store.error,
    }),
    [store.signIn, store.isLoading, store.error] // Depend on the specific values from the store
  );

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
      setLocalError("");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      setLocalError("Login failed. Please check the error message.");
    }
  };

  // --- SVG Icons (omitted for brevity) ---
  const googleIcon = (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      ...
    </svg>
  );
  const appleIcon = (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      ...
    </svg>
  );
  const facebookIcon = (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      ...
    </svg>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-4">{/* Logo placeholder */}</div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            Sign in
          </h2>

          {(localError || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {authError || localError}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={emailSubmitted ? handleSignIn : handleEmailContinue}
          >
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
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

            {/* Password Input (Conditional) */}
            {emailSubmitted && (
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
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
                <p className="mt-2 text-xs text-blue-500 text-right hover:underline">
                  <a href="/forget-password">Forget Password</a>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isLoading
                ? "Loading..."
                : emailSubmitted
                ? "Sign in"
                : "Continue"}
            </button>

            {emailSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setEmailSubmitted(false);
                  setPassword("");
                  setLocalError("");
                }}
                className="w-full text-blue-600 font-semibold hover:text-blue-700 py-2 text-sm"
              >
                Back
              </button>
            )}
          </form>

          {/* Social Links (Conditional) */}
          {!emailSubmitted && (
            <>
              <p className="pt-3 text-xs sm:text-sm text-gray-700">
                New to Zillow?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
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
                <SocialButton
                  icon={facebookIcon}
                  text="Continue with Facebook"
                />
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

      {/* Right Image */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-100 relative overflow-hidden">
        <img
          src="/signin-image.jpg"
          alt="Family enjoying time in front of their home"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
