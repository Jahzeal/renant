"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface PropertyTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (propertyType: string) => void
}

export default function PropertyTypeModal({ isOpen, onClose, onApply }: PropertyTypeModalProps) {
  const [selectedType, setSelectedType] = useState("All types")

  const propertyTypes = ["All types", "Home", "Shortlet", "Hostel"]

  const handleApply = () => {
    onApply(selectedType)
    onClose()
  }

  const handleReset = () => {
    setSelectedType("All types")
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-xl p-0 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Property Type</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full px-4 py-4 rounded-lg font-medium text-sm text-left transition-all ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "border border-border bg-white text-foreground hover:border-primary hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 text-primary font-semibold text-sm rounded-lg hover:bg-muted transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}