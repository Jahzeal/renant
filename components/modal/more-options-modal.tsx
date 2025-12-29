"use client";
import { X, Dog, Cat, CircleSlash } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export interface MoreOptionsFilters {
  moveInDate: string;
  selectedPets: string[];
  keywords: string;
  threeDTour: boolean;
}

interface MoreOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: MoreOptionsFilters) => void;
  initialFilters?: Partial<MoreOptionsFilters>;
}

export default function MoreOptionsModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: MoreOptionsModalProps) {
  const {
    keywords,
    setKeywords,
    selectedPets,
    handlePetToggle,
    moveInDate,
    setMoveInDate,
    resetFilters,
  } = useSearch({
    keywords: initialFilters?.keywords ?? "",
    selectedPets: initialFilters?.selectedPets ?? [],
    moveInDate: initialFilters?.moveInDate ?? "",
  });

  const petOptions = [
    { id: "small-dogs", label: "Allows small dogs", icon: Dog },
    { id: "large-dogs", label: "Allows large dogs", icon: Dog },
    { id: "cats", label: "Allows cats", icon: Cat },
    { id: "no-pets", label: "No pets allowed", icon: CircleSlash },
  ];
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApply = () => {
    onApply({
      moveInDate,
      selectedPets,
      keywords,
      threeDTour: false,
    });
    onClose();
  };

  const handleReset = () => {
    resetFilters();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 w-full">
        <div className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-lg shadow-xl max-h-[92vh] overflow-y-auto mx-auto">
          <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-border bg-white">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              More options
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Move in date
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Keywords
              </label>
              <input
                type="text"
                placeholder="Furnished, short term, etc."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-3">
                Pets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {petOptions.map((pet) => {
                  const IconComponent = pet.icon;
                  return (
                    <button
                      key={pet.id}
                      onClick={() => handlePetToggle(pet.id)}
                      className={`p-3 md:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPets.includes(pet.id)
                          ? "border-primary bg-muted"
                          : "border-border bg-white hover:border-muted"
                      }`}
                    >
                      <IconComponent size={24} className="text-foreground" />
                      <span className="text-xs md:text-sm font-medium text-center text-foreground">
                        {pet.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 flex gap-2 md:gap-3 p-4 md:p-6 border-t border-border bg-white">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-primary font-semibold text-sm md:text-base hover:bg-muted rounded-lg transition-colors"
            >
              Reset all filters
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm md:text-base rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")!
  );
}
