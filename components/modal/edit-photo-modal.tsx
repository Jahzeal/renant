"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"

interface EditPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage?: string
  onSave: (imageUrl: string) => void
}

export default function EditPhotoModal({ isOpen, onClose, currentImage, onSave }: EditPhotoModalProps) {
  const [preview, setPreview] = useState<string>(currentImage || "")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (preview) {
      setLoading(true)
      setTimeout(() => {
        onSave(preview)
        setLoading(false)
        onClose()
      }, 500)
    }
  }

  const handleRemovePhoto = () => {
    setPreview("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Edit photo</h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-muted rounded-full flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Photo preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-1/2 h-1/2 text-foreground/30" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              )}
            </div>
          </div>

          {/* Upload Input */}
          <div className="space-y-3">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg py-8 hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-foreground/60 mt-1">PNG, JPG, GIF up to 10MB</p>
            </button>
          </div>

          {/* Remove Photo Button */}
          {preview && (
            <button
              onClick={handleRemovePhoto}
              className="w-full py-2 px-4 text-foreground/60 hover:text-foreground border border-border rounded-md transition-colors text-sm font-medium"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border justify-end bg-background/50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-foreground font-medium hover:bg-muted rounded transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !preview}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? "Saving..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  )
}
