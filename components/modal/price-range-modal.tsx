"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface PriceRangeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (min: number, max: number) => void
}

export default function PriceRangeModal({ isOpen, onClose, onApply }: PriceRangeModalProps) {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [error, setError] = useState("")

  const handleApply = () => {
    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY

    if (min < 0 || max < 0) {
      setError("Prices cannot be negative")
      return
    }
    if (min > max) {
      setError("Min cannot be greater than Max")
      return
    }

    setError("")
    onApply(min, max)
    setMinPrice("")
    setMaxPrice("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Price Range</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Minimum price</label>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Maximum price</label>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="flex gap-3 p-4 md:p-6 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-foreground font-semibold text-sm md:text-base border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm md:text-base rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
