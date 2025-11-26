"use client";
import { useEffect, useState } from "react";
import { Search, ChevronDown, X, Dog, Cat, CircleSlash } from "lucide-react";
import { Button } from "./ui/button";
import PriceRangeModal from "./price-range-modal";
import BedsBathsModal from "./baths-bed-modal";
import PropertyTypeModal from "./property-type-modal";

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
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;

    if (min < 0 || max < 0) {
      setError("Prices cannot be negative");
      return;
    }
    if (min > max) {
      setError("Min cannot be greater than Max");
      return;
    }

    setError("");

    if (!minPrice && !maxPrice) {
      if (onApply) onApply(0, Number.POSITIVE_INFINITY);
      setSelected("");
    } else {
      if (onApply) onApply(min, max);
      setSelected(`$${minPrice || 0} - $${maxPrice || "∞"}`);
    }

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
        className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-xs sm:text-sm font-medium whitespace-nowrap"
      >
        {label}
        {!isPrice && selected ? `: ${selected}` : ""}
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 sm:left-0 right-0 sm:right-auto bg-white border border-border rounded-lg shadow-lg z-50 w-[220px] sm:w-auto p-3">
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
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: MoreOptionsFilters) => void;
}) => {
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

interface SearchBarProps {
  onSearch: (location: string, coords?: { lng: number; lat: number }) => void;
  onFiltersChange?: (filters: AppliedFilters) => void;
}

interface AppliedFilters {
  price: { min: number; max: number } | null;
  beds: string;
  baths: string;
  propertyType: string;
  moreOptions: MoreOptionsFilters | null;
}

export default function SearchBar({
  onSearch,
  onFiltersChange,
}: SearchBarProps) {
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isBedsBathsModalOpen, setIsBedsBathsModalOpen] = useState(false);
  const [isPropertyTypeModalOpen, setIsPropertyTypeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    price: null,
    beds: "Any",
    baths: "Any",
    propertyType: "All types",
    moreOptions: null,
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const geocodeLocation = async (location: string) => {
    if (!location.trim()) {
      onSearch("");
      return;
    }

    try {
      setIsSearching(true);
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (!token) {
        console.error("Mapbox token is missing");
        onSearch(location);
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${token}`
      );

      if (!response.ok) {
        console.error(
          `Mapbox API error: ${response.status} ${response.statusText}`
        );
        onSearch(location);
        return;
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        const placeName = data.features[0].place_name;
        onSearch(placeName, { lng, lat });
      } else {
        console.warn("No geocoding results found for:", location);
        onSearch(location);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      onSearch(location);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      onSearch("");
      return;
    }
    geocodeLocation(searchInput);
  };

  const handlePriceApply = (min: number, max: number) => {
    const updated = { ...appliedFilters, price: { min, max } };
    setAppliedFilters(updated);
    onFiltersChange?.(updated);
  };

  const handleBedsApply = (selection: { beds: string; baths: string }) => {
    const updated = {
      ...appliedFilters,
      beds: selection.beds,
      baths: selection.baths,
    };

    setAppliedFilters(updated);
    onFiltersChange?.(updated);
  };

  const handlePropertyTypeApply = (propertyType: string) => {
    const updated = { ...appliedFilters, propertyType };
    setAppliedFilters(updated);
    onFiltersChange?.(updated);
  };

  const handleMoreOptionsApply = (filters: MoreOptionsFilters) => {
    const updated = { ...appliedFilters, moreOptions: filters };
    setAppliedFilters(updated);
    onFiltersChange?.(updated);
  };

  const handleSaveChanges = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="max-w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-4 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-0 w-full">
            <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-lg px-3 sm:px-4 py-2">
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
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0 disabled:opacity-50"
                aria-label="Search"
              >
                <Search
                  size={20}
                  className="text-muted-foreground hover:text-foreground"
                />
              </button>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="sm:hidden px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm whitespace-nowrap disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 lg:gap-3 flex-wrap mt-3 w-full">
            <Button
              variant={selectedCategory === "houses" ? "default" : "outline"}
              onClick={() => setSelectedCategory("houses")}
              className="text-xs md:text-sm"
            >
              Houses
            </Button>
            <Button
              variant={selectedCategory === "shortlets" ? "default" : "outline"}
              onClick={() => setSelectedCategory("shortlets")}
              className="text-xs md:text-sm"
            >
              Shortlets
            </Button>
            <button
              onClick={() => setIsPriceModalOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-xs sm:text-sm font-medium whitespace-nowrap z-20"
            >
              Price
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsBedsBathsModalOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-xs sm:text-sm font-medium whitespace-nowrap z-20"
            >
              Beds & baths
              {appliedFilters.beds !== "Any" && `: ${appliedFilters.beds}`}
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsPropertyTypeModalOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-xs sm:text-sm font-medium whitespace-nowrap z-20"
            >
              Property type
              {appliedFilters.propertyType !== "All types" &&
                `: ${appliedFilters.propertyType}`}
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => setIsMoreOptionsOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-muted text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              More options
              <ChevronDown size={16} />
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 md:px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs sm:text-sm hover:opacity-90 whitespace-nowrap transition-all flex-shrink-0"
            >
              {isSaved ? "Saved ✅" : "Save changes"}
            </button>
          </div>

          {(appliedFilters.price ||
            appliedFilters.beds !== "Any" ||
            appliedFilters.propertyType !== "All types" ||
            appliedFilters.moreOptions) && (
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground space-y-1">
              <div className="flex flex-wrap gap-2">
                {appliedFilters.price &&
                  appliedFilters.price.min !== 0 &&
                  appliedFilters.price.max !== Number.POSITIVE_INFINITY && (
                    <span className="bg-muted px-2 py-1 rounded">
                      Price: ${appliedFilters.price.min} - $
                      {appliedFilters.price.max === Number.POSITIVE_INFINITY
                        ? "∞"
                        : appliedFilters.price.max}
                    </span>
                  )}

                {appliedFilters.beds !== "Any" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Beds: {appliedFilters.beds}
                  </span>
                )}
                {appliedFilters.propertyType !== "All types" && (
                  <span className="bg-muted px-2 py-1 rounded">
                    Type: {appliedFilters.propertyType}
                  </span>
                )}
              </div>
              {appliedFilters.moreOptions && (
                <div className="space-y-1">
                  {appliedFilters.moreOptions.moveInDate && (
                    <div>
                      Move in date:{" "}
                      {new Date(
                        appliedFilters.moreOptions.moveInDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                  {appliedFilters.moreOptions.selectedPets?.length > 0 && (
                    <div>
                      Pets: {appliedFilters.moreOptions.selectedPets.join(", ")}
                    </div>
                  )}
                  {appliedFilters.moreOptions.shortTermLease && (
                    <div>Short term lease available</div>
                  )}
                  {appliedFilters.moreOptions.commuteTime && (
                    <div>
                      Commute time: {appliedFilters.moreOptions.commuteTime}
                    </div>
                  )}
                  {appliedFilters.moreOptions.keywords && (
                    <div>Keywords: {appliedFilters.moreOptions.keywords}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PriceRangeModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onApply={handlePriceApply}
      />
      <BedsBathsModal
        isOpen={isBedsBathsModalOpen}
        onClose={() => setIsBedsBathsModalOpen(false)}
        onApply={handleBedsApply} // ✅ Now correctly accepts {beds, baths}
      />

      <PropertyTypeModal
        isOpen={isPropertyTypeModalOpen}
        onClose={() => setIsPropertyTypeModalOpen(false)}
        onApply={handlePropertyTypeApply}
      />

      <MoreOptionsModal
        isOpen={isMoreOptionsOpen}
        onClose={() => setIsMoreOptionsOpen(false)}
        onApply={handleMoreOptionsApply}
      />
    </>
  );
}