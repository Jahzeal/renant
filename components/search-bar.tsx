"use client"
import { useEffect, useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import PriceRangeModal from "./modal/price-range-modal"
import BedsBathsModal from "./modal/beds-bath-modal"
import PropertyTypeModal from "./modal/property-type-modal"
import MoreOptionsModal, { type MoreOptionsFilters } from "./modal/more-options-modal"

interface FilterProps {
  label: string
  options?: string[]
  isPrice?: boolean
  onApply?: (min: number, max: number) => void
  onSelect?: (selected: string) => void
}

const FilterButton = ({ label, options = [], isPrice = false, onApply, onSelect }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(options[0] ?? "")
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

    if (!minPrice && !maxPrice) {
      if (onApply) onApply(0, Number.POSITIVE_INFINITY)
      setSelected("")
    } else {
      if (onApply) onApply(min, max)
      setSelected(`$${minPrice || 0} - $${maxPrice || "∞"}`)
    }

    setIsOpen(false)
  }

  const handleOptionSelect = (option: string) => {
    setSelected(option)
    setIsOpen(false)
    if (onSelect) onSelect(option)
  }

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
  )
}

interface SearchBarProps {
  onSearch: (location: string, coords?: { lng: number; lat: number }) => void
  onFiltersChange?: (filters: AppliedFilters) => void
  filters?: AppliedFilters
}

interface AppliedFilters {
  category?: string
  price: { min: number; max: number } | null
  beds: string
  baths: string
  propertyType: string
  moreOptions: MoreOptionsFilters | null
}

export default function SearchBar({ onSearch, onFiltersChange, filters }: SearchBarProps) {
  const [mounted, setMounted] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isBedsBathsModalOpen, setIsBedsBathsModalOpen] = useState(false)
  const [isPropertyTypeModalOpen, setIsPropertyTypeModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("houses") // Default to houses
  const [isSearching, setIsSearching] = useState(false)

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    category: "houses",
    price: null,
    beds: "Any",
    baths: "Any",
    propertyType: "All types",
    moreOptions: null,
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (filters) {
      setAppliedFilters(filters)
    }
  }, [filters])

  if (!mounted) return null

  const geocodeLocation = async (location: string) => {
    if (!location.trim()) {
      onSearch("")
      return
    }

    try {
      setIsSearching(true)
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

      if (!token) {
        console.error("Mapbox token is missing")
        onSearch(location)
        return
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${token}`,
      )

      if (!response.ok) {
        console.error(`Mapbox API error: ${response.status} ${response.statusText}`)
        onSearch(location)
        return
      }

      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        const placeName = data.features[0].place_name
        onSearch(placeName, { lng, lat })
      } else {
        console.warn("No geocoding results found for:", location)
        onSearch(location)
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      onSearch(location)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = () => {
    if (!searchInput.trim()) {
      onSearch("")
      return
    }
    geocodeLocation(searchInput)
  }

  const handlePriceApply = (min: number, max: number) => {
    const updated = { ...appliedFilters, price: { min, max } }
    setAppliedFilters(updated)
  }

  const handleBedsApply = (selection: { beds: string; baths: string }) => {
    const updated = {
      ...appliedFilters,
      beds: selection.beds,
      baths: selection.baths,
    }
    setAppliedFilters(updated)
  }

  const handlePropertyTypeApply = (propertyType: string) => {
    const updated = { ...appliedFilters, propertyType }
    setAppliedFilters(updated)
  }

  const handleMoreOptionsApply = (filters: MoreOptionsFilters) => {
    const updated = { ...appliedFilters, moreOptions: filters }
    setAppliedFilters(updated)
  }

  const handleApplyFilters = () => {
    console.log("Applying filters:", appliedFilters) 
    onFiltersChange?.(appliedFilters)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

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
                  if (e.key === "Enter") handleSearch()
                }}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0 disabled:opacity-50"
                aria-label="Search"
              >
                <Search size={20} className="text-muted-foreground hover:text-foreground" />
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
              onClick={() => {
                setSelectedCategory("houses")
                const updated = { ...appliedFilters, category: "houses" }
                setAppliedFilters(updated)
              }}
            >
              Houses
            </Button>

            <Button
              variant={selectedCategory === "shortlets" ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory("shortlets")
                const updated = { ...appliedFilters, category: "shortlets" }
                setAppliedFilters(updated)
              }}
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
              {appliedFilters.propertyType !== "All types" && `: ${appliedFilters.propertyType}`}
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
              onClick={handleApplyFilters}
              className="px-4 md:px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs sm:text-sm hover:opacity-90 whitespace-nowrap transition-all flex-shrink-0"
            >
              {isSaved ? "Applied ✅" : "Apply Filters"}
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
                      Price: ₦{appliedFilters.price.min} - ₦
                      {appliedFilters.price.max === Number.POSITIVE_INFINITY ? "∞" : appliedFilters.price.max}
                    </span>
                  )}

                {appliedFilters.beds !== "Any" && (
                  <span className="bg-muted px-2 py-1 rounded">Beds: {appliedFilters.beds}</span>
                )}
                {appliedFilters.propertyType !== "All types" && (
                  <span className="bg-muted px-2 py-1 rounded">Type: {appliedFilters.propertyType}</span>
                )}
              </div>
              {appliedFilters.moreOptions && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {appliedFilters.moreOptions.moveInDate && (
                    <span className="bg-muted px-2 py-1 rounded">Move in: {appliedFilters.moreOptions.moveInDate}</span>
                  )}
                  {appliedFilters.moreOptions.selectedPets.length > 0 && (
                    <span className="bg-muted px-2 py-1 rounded">
                      Pets: {appliedFilters.moreOptions.selectedPets.join(", ")}
                    </span>
                  )}
                  {appliedFilters.moreOptions.keywords && (
                    <span className="bg-muted px-2 py-1 rounded">Keywords: {appliedFilters.moreOptions.keywords}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <MoreOptionsModal
        isOpen={isMoreOptionsOpen}
        onClose={() => setIsMoreOptionsOpen(false)}
        onApply={handleMoreOptionsApply}
        initialFilters={appliedFilters.moreOptions || undefined}
      />

      <PriceRangeModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onApply={handlePriceApply}
      />
      <BedsBathsModal
        isOpen={isBedsBathsModalOpen}
        onClose={() => setIsBedsBathsModalOpen(false)}
        onApply={handleBedsApply}
      />
      <PropertyTypeModal
        isOpen={isPropertyTypeModalOpen}
        onClose={() => setIsPropertyTypeModalOpen(false)}
        onApply={handlePropertyTypeApply}
      />
    </>
  )
}
