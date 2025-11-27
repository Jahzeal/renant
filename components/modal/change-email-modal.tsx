"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChangeEmailModalProps {
  isOpen: boolean
  onClose: () => void
  currentEmail: string
  onSave: (newEmail: string, password: string) => void
}

export default function ChangeEmailModal({ isOpen, onClose, currentEmail, onSave }: ChangeEmailModalProps) {
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSave = () => {
    if (newEmail && password) {
      onSave(newEmail, password)
      setNewEmail("")
      setPassword("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-white rounded-lg w-full sm:max-w-md p-6 shadow-lg animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Change your email</h2>
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
            <p className="text-sm text-foreground mb-3">
              1. Your current email is <span className="font-semibold">{currentEmail}</span>. Enter a new email address.
            </p>
            <label className="block text-sm font-medium text-foreground mb-2">Enter new email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <p className="text-sm text-foreground mb-3">2. Enter the password you currently use to login.</p>
            <label className="block text-sm font-medium text-foreground mb-2">Enter password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="text-sm text-primary hover:text-primary/80 mt-2 font-medium">Forgot password?</button>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6">
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
