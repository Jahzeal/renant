"use client";

import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const MIN_VAL = 0;
  const MAX_VAL = 1000000;

  const handleApply = () => {
    const min = minPrice ? Number(minPrice) : MIN_VAL;
    const max = maxPrice ? Number(maxPrice) : MAX_VAL;

    if (min < 0 || max < 0) {
      setError("Prices cannot be negative");
      return;
    }
    if (min > max) {
      setError("Min cannot be greater than Max");
      return;
    }

    setError("");
    onApply(min, max);
    onClose();
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-xl p-0 mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Price Range</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Min
              </label>
              <input
                type="text"
                placeholder="No min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Max
              </label>
              <input
                type="text"
                placeholder="No max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50"
              />
            </div>

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
          </div>

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
  );
}