"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text }) => (
  <button className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

export default function SignupPage() {
  const router = useRouter();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Individual selectors (safe for App Router)
  const signUp = useAuth(state => state.signUp);
  const isLoading = useAuth(state => state.isLoading);
  const authError = useAuth(state => state.error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim()) {
      setEmailSubmitted(true);
      setError("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      setError("Full name is required");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp({
        email: formData.email,
        firstName: formData.firstName,
        lastName: "",
        password: formData.password,
      });

      router.push("/");
    } catch {
      setError(authError || "Sign up failed. Please try again.");
    }
  };

  // --- SVG Icons ---
  const googleIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      {/* ...paths omitted for brevity */}
    </svg>
  );
  const appleIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      {/* ...paths omitted for brevity */}
    </svg>
  );
  const facebookIcon = (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      {/* ...paths omitted for brevity */}
    </svg>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
            {emailSubmitted ? "Tell us about yourself" : "Create account"}
          </h2>

          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error || authError}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={emailSubmitted ? handleSignUp : handleEmailContinue}
          >
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                disabled={emailSubmitted}
                required
                className="w-full mt-1 p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {emailSubmitted && (
              <>
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-xs font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mt-3 block">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isLoading
                ? "Loading..."
                : emailSubmitted
                ? "Create account"
                : "Continue"}
            </button>

            {emailSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setEmailSubmitted(false);
                  setError("");
                }}
                className="w-full text-blue-600 font-semibold hover:text-blue-700 py-2 text-sm"
              >
                Back
              </button>
            )}
          </form>

          {!emailSubmitted && (
            <>
              <p className="pt-3 text-xs sm:text-sm text-gray-700 text-center">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign in
                </Link>
              </p>

              <div className="flex items-center space-x-3 my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs font-medium text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="space-y-2">
                <SocialButton icon={googleIcon} text="Sign up with Google" />
                <SocialButton icon={appleIcon} text="Sign up with Apple" />
                <SocialButton icon={facebookIcon} text="Sign up with Facebook" />
              </div>

              <p className="pt-2 text-xs text-gray-500 text-center">
                By submitting, I accept Zillow's{" "}
                <a href="#" className="text-blue-600 hover:underline">terms of use</a> and{" "}
                <a href="#" className="text-blue-600 hover:underline">privacy policy</a>
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
  );
}
