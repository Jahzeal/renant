"use client";

import { useState,useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface PropertyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (propertyType: string) => void;
}

export default function PropertyTypeModal({
  isOpen,
  onClose,
  onApply,
}: PropertyTypeModalProps) {
  const [selectedType, setSelectedType] = useState("All types");

  const propertyTypes = ["All types", "Home", "Shortlet", "Hostel"];
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApply = () => {
    onApply(selectedType);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-md bg-white rounded-t-2xl md:rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Property Type
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:border-primary hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
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
    </>,
    document.getElementById("modal-root")!
  );
}
