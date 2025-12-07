"use client"
import { useState, useMemo } from "react"
import { useFavorites } from "@/lib/favorites-context"
import ListingCard from "./listing-card"
import ListingDetailsModal from "./modal/listing-details-modal"
import { SAMPLE_LISTINGS } from "@/lib/sample-listing"
import type { MoreOptionsFilters } from "./modal/more-options-modal"

interface AppliedFilters {
  price: { min: number; max: number } | null
  roomType: string
  propertyType: string
  category: string
  moreOptions: MoreOptionsFilters | null
}

interface ListingsPanelProps {
  searchLocation?: string
  filters?: AppliedFilters
  onLocationClick?: (coords: { lng: number; lat: number }, address: string) => void
}

interface Listing {
  id: string
  images: string[]
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  room_type: "room_self_contain" | "2_bedrooms" | "room_parlor" | "3_plus_bedrooms"
  style: string
  offer: string | null
  prices: { beds: number; price: number }[]
  location: string
  type: string
  description?: string
  amenities?: string[]
  coords?: { lng: number; lat: number }
}

export default function ListingsPanel({ searchLocation = "", filters, onLocationClick }: ListingsPanelProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "newest" | "lot-size">(
    "recommended",
  )

  const filteredListings = useMemo(() => {
    let results = [...SAMPLE_LISTINGS]

    if (filters?.category && filters.category !== "all") {
      const categoryMap: { [key: string]: string } = {
        houses: "Home",
        shortlets: "Shortlet",
        hostels: "Hostel",
      }
      const typeToFilter = categoryMap[filters.category]
      if (typeToFilter) {
        results = results.filter((listing) => listing.type === typeToFilter)
      }
    }

    if (filters?.propertyType && filters.propertyType !== "All types") {
      const propertyTypeMap: { [key: string]: string } = {
        Home: "Home",
        Shortlet: "Shortlet",
        Hostel: "Hostel",
      }
      const typeToFilter = propertyTypeMap[filters.propertyType]
      if (typeToFilter) {
        results = results.filter((listing) => listing.type === typeToFilter)
      }
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

    if (filters?.price && (filters.price.min !== 0 || filters.price.max !== Number.POSITIVE_INFINITY)) {
      const { min, max } = filters.price
      results = results.filter((listing) => listing.price >= min && listing.price <= max)
    }

    if (filters?.roomType && filters.roomType !== "Any") {
      const roomTypeMap: { [key: string]: string } = {
        "Room self-contain": "room_self_contain",
        "2 bedrooms": "2_bedrooms",
        "Room & parlor": "room_parlor",
        "3+ bedrooms": "3_plus_bedrooms",
      }
      const roomTypeToFilter = roomTypeMap[filters.roomType]
      if (roomTypeToFilter) {
        results = results.filter((listing) => listing.room_type === roomTypeToFilter)
      }
    }

    if (filters?.moreOptions) {
      const more = filters.moreOptions

      // Keywords
      if (more.keywords && more.keywords.trim() !== "") {
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

          // If "no-pets" is selected, only show listings that mention no pets
          if (more.selectedPets.includes("no-pets")) {
            return text.includes("no pet")
          }

          // Otherwise, check for pet-friendly listings
          return more.selectedPets.some((pet) => {
            if (pet === "small-dogs") return text.includes("small") && text.includes("dog")
            if (pet === "large-dogs") return text.includes("large") && text.includes("dog")
            if (pet === "cats") return text.includes("cat")
            return false
          })
        })
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
                setSortBy(e.target.value as "recommended" | "price-low" | "price-high" | "newest" | "lot-size")
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
              onFavoriteToggle={() => toggleFavorite(listing.id)}
              onViewDetails={() => handleViewDetails(listing)}
              onLocationClick={() => {
                if (listing.coords) {
                  onLocationClick?.(listing.coords, listing.address)
                }
              }}
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
            price: `₦${selectedListing.price}`,
            beds: selectedListing.bedrooms,
            baths: selectedListing.bathrooms,
            images: selectedListing.images,
            description: selectedListing.description,
            amenities: selectedListing.amenities,
            type: selectedListing.type,
          }}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={favorites.includes(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
    </div>
  )
}
