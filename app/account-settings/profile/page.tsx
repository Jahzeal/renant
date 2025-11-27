"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import EditNameModal from "@/components/modal/edit-name-modal"
import EditScreenNameModal from "@/components/modal/edit-screen-name-modal"
import ChangeEmailModal from "@/components/modal/change-email-modal"
import ChangePasswordModal from "@/components/modal/change-password-modal"
import PageHeader from "@/components/page-header"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.firstName || "N/A")
  const [displayScreenName, setDisplayScreenName] = useState(user?.screenName || "")
  const [displayEmail, setDisplayEmail] = useState(user?.email || "")

  const [editNameOpen, setEditNameOpen] = useState(false)
  const [editScreenNameOpen, setEditScreenNameOpen] = useState(false)
  const [editEmailOpen, setEditEmailOpen] = useState(false)
  const [editPasswordOpen, setEditPasswordOpen] = useState(false)

  const handleSaveName = (firstName: string, lastName: string) => {
    const fullName = `${firstName} ${lastName}`.trim()
    setDisplayName(fullName || firstName)
    if (user) {
      updateProfile(firstName, user.screenName, user.email)
    }
  }

  const handleSaveScreenName = (screenName: string) => {
    setDisplayScreenName(screenName)
    if (user) {
      updateProfile(user.firstName, screenName, user.email)
    }
  }

  const handleSaveEmail = (newEmail: string, password: string) => {
    setDisplayEmail(newEmail)
    if (user) {
      updateProfile(user.firstName, user.screenName, newEmail)
    }
  }

  const handleSavePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
    console.log(" Password changed successfully")
  }

  return (
    <>
      <PageHeader/>
      <div className="flex flex-col bg-white min-h-[calc(100vh-64px)]">
        {/* Back Navigation */}
        <div className="border-b border-border bg-white sticky top-0 z-20">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4">
            <Link
              href="/account-settings"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
            >
              <ChevronLeft size={18} />
              Back to Account settings
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">Profile</h1>

            {/* Content Container */}
            <div className="border border-border rounded-lg p-6 sm:p-8">
              {/* Personal Info Section */}
              <div className="mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Personal Info</h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Name</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Your first and last given names. Updates are reflected across all Zillow experiences.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">{displayName}</p>
                      <button
                        onClick={() => setEditNameOpen(true)}
                        className="text-primary hover:text-primary/80 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Screen name */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Screen name</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="font-medium text-foreground text-sm sm:text-base">{displayScreenName}</p>
                      <button
                        onClick={() => setEditScreenNameOpen(true)}
                        className="text-primary hover:text-primary/80 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Photo</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Personalize your profile pic with a custom photo.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                          src={user?.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <button className="text-primary hover:text-primary/80 font-medium text-sm">Edit</button>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="flex items-start justify-between py-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Reviews</h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        Manage the reviews you've written for professionals, rentals, and more.
                      </p>
                    </div>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm flex-shrink-0 whitespace-nowrap">
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign in & Security Section */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Sign in & Security</h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start justify-between py-4 border-b border-border/50 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Email</h3>
                      <p className="text-sm text-foreground/60 mt-1">The email address associated with your account.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-medium text-foreground text-sm sm:text-base">{displayEmail}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-primary hover:text-primary/80 font-medium text-sm">Verify</button>
                        <span className="text-foreground/30">•</span>
                        <button
                          onClick={() => setEditEmailOpen(true)}
                          className="text-primary hover:text-primary/80 font-medium text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-start justify-between py-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">Password</h3>
                      <p className="text-sm text-foreground/60 mt-1">Set a unique password to protect your account.</p>
                    </div>
                    <button
                      onClick={() => setEditPasswordOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm px-4 py-2 rounded transition-colors flex-shrink-0 whitespace-nowrap"
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <EditNameModal
        isOpen={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        firstName={user?.firstName || ""}
        lastName=""
        onSave={handleSaveName}
      />
      <EditScreenNameModal
        isOpen={editScreenNameOpen}
        onClose={() => setEditScreenNameOpen(false)}
        screenName={displayScreenName}
        onSave={handleSaveScreenName}
      />
      <ChangeEmailModal
        isOpen={editEmailOpen}
        onClose={() => setEditEmailOpen(false)}
        currentEmail={displayEmail}
        onSave={handleSaveEmail}
      />
      <ChangePasswordModal
        isOpen={editPasswordOpen}
        onClose={() => setEditPasswordOpen(false)}
        onSave={handleSavePassword}
      />
    </>
  )
}
