"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface PriceRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (min: number, max: number) => void;
}

export default function PriceRangeModal({
  isOpen,
  onClose,
  onApply,
}: PriceRangeModalProps) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleApply = () => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;

    if (min < 0 || max < 0) {
      setError("Prices cannot be negative");
      return;
    }
    if (minPrice && maxPrice && min > max) {
      setError("Min price cannot be greater than max");
      return;
    }

    setError("");
    onApply(min, max);
    setMinPrice("");
    setMaxPrice("");
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Price Range</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Price (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 3000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Price (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm font-medium">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border bg-muted/50">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 border border-border font-medium rounded-xl hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")!
  );
}
