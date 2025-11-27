"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditScreenNameModalProps {
  isOpen: boolean
  onClose: () => void
  screenName: string
  onSave: (screenName: string) => void
}

export default function EditScreenNameModal({ isOpen, onClose, screenName, onSave }: EditScreenNameModalProps) {
  const [name, setName] = useState(screenName)

  const handleSave = () => {
    onSave(name)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-white rounded-lg w-full sm:max-w-md p-6 shadow-lg animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Edit screen name</h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Screen name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
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
