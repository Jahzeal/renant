"use client"
import { useState, useMemo } from "react"
import ListingCard from "./listing-card"
import ListingDetailsModal from "./listing-details-modal"
import { SAMPLE_LISTINGS } from "@/lib/sample-listing"

interface MoreOptionsFilters {
  moveInDate?: string
  selectedPets?: string[]
  shortTermLease?: boolean
  commuteTime?: string
  keywords?: string
  baths?: string   // ✅ ADDED
}

interface AppliedFilters {
  price: { min: number; max: number } | null
  beds: string
  propertyType: string
  moreOptions: MoreOptionsFilters | null
}

interface ListingsPanelProps {
  searchLocation?: string
  filters?: AppliedFilters
}

interface Listing {
  id: string
  images: string[]
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  style: string
  offer: string | null
  prices: { beds: number; price: number }[]
  location: string
  type: string
  description?: string
  amenities?: string[]
}

export default function ListingsPanel({ searchLocation = "", filters }: ListingsPanelProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [sortBy, setSortBy] = useState<
    "recommended" | "price-low" | "price-high" | "newest" | "lot-size"
  >("recommended")

  const filteredListings = useMemo(() => {
    let results = [...SAMPLE_LISTINGS]

    // FILTER — Property Type
    if (filters?.propertyType && filters.propertyType !== "All types") {
      results = results.filter(
        (listing) => listing.type.toLowerCase() === filters.propertyType.toLowerCase(),
      )
    }

    // FILTER — Location Search
    if (searchLocation) {
      const searchTerm = searchLocation.toLowerCase().trim()
      const searchCity = searchTerm.split(",")[0].trim()

      results = results.filter(
        (listing) =>
          listing.location.toLowerCase().includes(searchCity) ||
          listing.location.toLowerCase().includes(searchTerm) ||
          listing.address.toLowerCase().includes(searchCity) ||
          listing.address.toLowerCase().includes(searchTerm),
      )
    }

    // FILTER — Price
    if (filters?.price) {
      const { min, max } = filters.price
      results = results.filter((listing) => listing.price >= min && listing.price <= max)
    }

    // FILTER — Bedrooms
    if (filters?.beds && filters.beds !== "Any") {
      results = results.filter((listing) => {
        if (filters.beds === "1+") return listing.bedrooms >= 1
        if (filters.beds === "2+") return listing.bedrooms >= 2
        if (filters.beds === "3+") return listing.bedrooms >= 3
        if (filters.beds === "4+") return listing.bedrooms >= 4
        if (filters.beds === "5+") return listing.bedrooms >= 5
        return true
      })
    }

    // FILTER — Bathrooms (added)
    if (filters?.moreOptions?.baths && filters.moreOptions.baths !== "Any") {
      const val = filters.moreOptions.baths

      results = results.filter((listing) => {
        if (val === "1+") return listing.bathrooms >= 1
        if (val === "1.5+") return listing.bathrooms >= 1.5
        if (val === "2+") return listing.bathrooms >= 2
        if (val === "3+") return listing.bathrooms >= 3
        if (val === "4+") return listing.bathrooms >= 4
        return true
      })
    }

    // ========= MORE OPTIONS ==========
    if (filters?.moreOptions) {
      const more = filters.moreOptions

      // Keywords
      if (more.keywords) {
        const keyword = more.keywords.toLowerCase()
        results = results.filter(
          (listing) =>
            listing.title.toLowerCase().includes(keyword) ||
            listing.description?.toLowerCase().includes(keyword) ||
            listing.amenities?.some((a) => a.toLowerCase().includes(keyword)),
        )
      }

      // Pets
      if (more.selectedPets && more.selectedPets.length > 0) {
        results = results.filter((listing) => {
          const text = `${listing.title} ${listing.description ?? ""} ${(listing.amenities ?? []).join(
            " ",
          )}`.toLowerCase()

          return more.selectedPets!.some((pet) => {
            if (pet === "small-dogs") return text.includes("small") && text.includes("dog")
            if (pet === "large-dogs") return text.includes("large") && text.includes("dog")
            if (pet === "cats") return text.includes("cat")
            if (pet === "no-pets") return text.includes("no pet")
            return false
          })
        })
      }

      // Short-term lease
      if (more.shortTermLease) {
        results = results.filter(
          (listing) => listing.type.toLowerCase() === "shortlet",
        )
      }
    }

    // SORTING
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        results.sort((a, b) => b.price - a.price)
        break
      case "newest":
        results.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      default:
        break
    }

    return results
  }, [searchLocation, filters, sortBy])

  // FAVORITE HANDLER
  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing)
    setIsDetailsOpen(true)
  }

  const listingCount = filteredListings.length

  return (
    <div className="bg-white w-full h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 sm:p-6 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="text-xl sm:text-4xl font-bold">Rental Listings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchLocation
                ? `${listingCount} rental${listingCount === 1 ? "" : "s"} found in ${searchLocation}`
                : `${listingCount} rentals available`}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "recommended" | "price-low" | "price-high" | "newest" | "lot-size",
                )
              }
              className="
                w-full sm:w-48 text-primary font-semibold text-sm cursor-pointer px-3 py-2
                border border-primary rounded-md bg-white
              "
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Payment (Low to High)</option>
              <option value="price-high">Payment (High to Low)</option>
              <option value="newest">Newest</option>
              <option value="lot-size">Lot size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="flex-1 divide-y overflow-y-auto">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={favorites.includes(listing.id)}
              onFavoriteToggle={() => handleFavoriteToggle(listing.id)}
              onViewDetails={() => handleViewDetails(listing)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p>No listings found for "{searchLocation}"</p>
            <p className="text-xs mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedListing && (
        <ListingDetailsModal
          listing={{
            id: Number(selectedListing.id),
            title: selectedListing.title,
            location: selectedListing.location,
            price: `$${selectedListing.price}`,
            beds: selectedListing.bedrooms,
            baths: selectedListing.bathrooms,
            images: selectedListing.images,
            description: selectedListing.description,
            amenities: selectedListing.amenities,
          }}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={favorites.includes(selectedListing.id)}
          onFavoriteToggle={() => handleFavoriteToggle(selectedListing.id)}
        />
      )}
    </div>
  )
}