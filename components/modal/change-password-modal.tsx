"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => void
}

export default function ChangePasswordModal({ isOpen, onClose, onSave }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSave = () => {
    setError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    onSave(currentPassword, newPassword, confirmPassword)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-white rounded-lg w-full sm:max-w-md p-6 shadow-lg animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Change password</h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="text-sm text-primary hover:text-primary/80 mt-2 font-medium">Forgot password?</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-foreground/60 mt-2">
              At least 8 characters
              <br />
              Mix of letters, numbers
              <br />
              Contains a special character
              <br />
              Mix of uppercase and lowercase letters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6">
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
