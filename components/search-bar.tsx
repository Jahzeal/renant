"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, X, Dog, Cat, CircleSlash } from "lucide-react";
import { Button } from "./ui/button";

// -------------------- FilterButton --------------------

interface FilterProps {
  label: string;
  options?: string[];
  isPrice?: boolean;
  onApply?: (min: number, max: number) => void;
  onSelect?: (selected: string) => void;
}

const FilterButton = ({
  label,
  options = [],
  isPrice = false,
  onApply,
  onSelect,
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0] ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (isNaN(min) || isNaN(max)) {
      setError("Please enter valid numbers");
      return;
    }
    if (min < 0 || max < 0) {
      setError("Prices cannot be negative");
      return;
    }
    if (min > max) {
      setError("Min cannot be greater than Max");
      return;
    }

    setError("");
    if (onApply) onApply(min, max);
    setSelected(`$${min} - $${max}`);
    setIsOpen(false);
  };

  const handleOptionSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-sm font-medium whitespace-nowrap"
      >
        {label}
        {!isPrice && selected ? `: ${selected}` : ""}
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-border rounded-lg shadow-lg z-10 min-w-max p-3">
          {isPrice ? (
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border border-border rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border border-border rounded px-2 py-1 text-sm"
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <button
                onClick={handleApply}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90"
              >
                Apply
              </button>
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="block w-full text-left px-4 py-2 hover:bg-muted text-sm text-foreground first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// -------------------- MoreOptionsModal (Zillow-free) --------------------

interface MoreOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: MoreOptionsFilters) => void;
}

interface MoreOptionsFilters {
  moveInDate: string;
  selectedPets: string[];
  shortTermLease: boolean;
  commuteTime: string;
  showCommuteFilters: boolean;
  keywords: string;
  threeDTour: boolean;
}

const MoreOptionsModal = ({
  isOpen,
  onClose,
  onApply,
}: MoreOptionsModalProps) => {
  const [moveInDate, setMoveInDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [shortTermLease, setShortTermLease] = useState(false);
  const [commuteTime, setCommuteTime] = useState("");
  const [showCommuteFilters, setShowCommuteFilters] = useState(false);
  const [keywords, setKeywords] = useState("");

  const petOptions = [
    { id: "small-dogs", label: "Allows small dogs", icon: Dog },
    { id: "large-dogs", label: "Allows large dogs", icon: Dog },
    { id: "cats", label: "Allows cats", icon: Cat },
    { id: "no-pets", label: "No pets allowed", icon: CircleSlash },
  ];

  const handlePetToggle = (petId: string) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const handleApply = () => {
    onApply({
      moveInDate,
      selectedPets,
      shortTermLease,
      commuteTime,
      showCommuteFilters,
      keywords,
      threeDTour: false,
    });
    onClose();
  };

  const handleReset = () => {
    setMoveInDate("");
    setSelectedPets([]);
    setShortTermLease(false);
    setCommuteTime("");
    setShowCommuteFilters(false);
    setKeywords("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
        <div className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="short-term-lease"
                checked={shortTermLease}
                onChange={(e) => setShortTermLease(e.target.checked)}
                className="w-4 h-4 rounded border border-border cursor-pointer"
              />
              <label
                htmlFor="short-term-lease"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Short term lease available
              </label>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Commute time
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter address, city, state and ZIP code"
                  value={commuteTime}
                  onChange={(e) => setCommuteTime(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  className="px-3 py-2 text-primary font-medium text-sm hover:underline"
                  aria-label="Use current location"
                >
                  📍
                </button>
              </div>
              <button
                onClick={() => setShowCommuteFilters(!showCommuteFilters)}
                className="text-primary text-sm font-semibold hover:underline"
              >
                {showCommuteFilters ? "Hide" : "Show"} commute filters
              </button>
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
    </>
  );
};

// -------------------- SearchBar --------------------

interface SearchBarProps {
  onSearch: (location: string, coords?: { lng: number; lat: number }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<MoreOptionsFilters | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("Any");
  const [selectedPropertyType, setSelectedPropertyType] = useState("All types");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleMoreOptionsApply = (filters: MoreOptionsFilters) =>
    setAppliedFilters(filters);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      onSearch("");
      return;
    }
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        onSearch(searchInput, { lng, lat });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          {/* Search input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3 sm:mb-0">
            <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2">
              <Search size={20} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Address, neighborhood, city, ZIP"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={handleSearch}
              className="sm:hidden px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="hidden sm:flex items-center gap-3 flex-wrap mt-3">
            <Button
              variant={selectedCategory === "houses" ? "default" : "outline"}
              onClick={() => setSelectedCategory("houses")}
            >
              Houses
            </Button>
            <Button
              variant={selectedCategory === "shortlets" ? "default" : "outline"}
              onClick={() => setSelectedCategory("shortlets")}
            >
              Shortlets
            </Button>
            <FilterButton
              label="Price"
              isPrice
              onApply={(min, max) => setPriceRange({ min, max })}
            />
            <FilterButton
              label="Beds & baths"
              options={["Any", "1 bed", "2 beds", "3+ beds"]}
              onSelect={(val) => setSelectedBeds(val)}
            />
            <FilterButton
              label="Property type"
              options={["All types", "Apartment", "House", "Condo"]}
              onSelect={(val) => setSelectedPropertyType(val)}
            />
            <button
              onClick={() => setIsMoreOptionsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-sm font-medium whitespace-nowrap"
            >
              More options
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
              }}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 whitespace-nowrap"
            >
              {isSaved ? "Saved ✅" : "Save search"}
            </button>
          </div>

          {/* Applied filters display */}
          {(priceRange || appliedFilters) && (
            <div className="mt-2 text-sm text-muted-foreground space-y-1">
              {priceRange && (
                <div>
                  Applied Price: ${priceRange.min} - ${priceRange.max}
                </div>
              )}
              {appliedFilters && (
                <>
                  {appliedFilters.moveInDate && (
                    <div>
                      Move in date:{" "}
                      {new Date(appliedFilters.moveInDate).toLocaleDateString()}
                    </div>
                  )}
                  {appliedFilters.selectedPets?.length > 0 && (
                    <div>Pets: {appliedFilters.selectedPets.join(", ")}</div>
                  )}
                  {appliedFilters.shortTermLease && (
                    <div>Short term lease available</div>
                  )}
                  {appliedFilters.commuteTime && (
                    <div>Commute time: {appliedFilters.commuteTime}</div>
                  )}
                  {appliedFilters.keywords && (
                    <div>Keywords: {appliedFilters.keywords}</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <MoreOptionsModal
        isOpen={isMoreOptionsOpen}
        onClose={() => setIsMoreOptionsOpen(false)}
        onApply={handleMoreOptionsApply}
      />
    </>
  );
}
