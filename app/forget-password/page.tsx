"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    // Simulate sending reset email (replace with real API call later)
    setTimeout(() => {
      setEmailSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="mt-3 text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success Message */}
          {emailSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600">
                We sent a password reset link to
                <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <button
                onClick={() => router.push("/signin")}
                className="mt-8 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-600 disabled:cursor-not-allowed transition shadow-md"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-100">
        <img
          src="/signin-image.jpg"
          alt="Happy home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    </div>
  );
}