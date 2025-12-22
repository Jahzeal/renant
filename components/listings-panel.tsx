"use client"

import { useState, useEffect, useMemo } from "react"
import { useFavorites } from "@/lib/favorites-context"
import ListingCard from "./listing-card"
import ListingDetailsModal from "./modal/listing-details-modal"
import { getRentals } from "@/lib/getRentals-api"
import type { MoreOptionsFilters } from "./modal/more-options-modal"

interface AppliedFilters {
  category?: string
  price: { min: number; max: number } | null
  beds: string
  baths: string
  propertyType: string
  moreOptions: MoreOptionsFilters | null
}

interface ListingsPanelProps {
  searchLocation?: string
  filters?: AppliedFilters
  onLocationClick?: (coords: { lng: number; lat: number }, address: string) => void
}

interface Amenity {
  id: string
  name: string
  propertyId: string
}

interface Listing {
  id: string
  images: string[]
  title: string
  address: string
  price: number
  beds: number
  baths: number
  room_type?: "room_self_contain" | "2_bedrooms" | "room_parlor" | "3_plus_bedrooms"
  style: string
  offers: string | null
  prices?: { beds: number; price: number }[]
  location: string
  type: string
  description?: string
  amenities?: string[]
  coords?: { lng: number; lat: number }
}

export default function ListingsPanel({ searchLocation = "", filters, onLocationClick }: ListingsPanelProps) {
  const { toggleFavorite, isFavorited } = useFavorites()

  const [allListings, setAllListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "newest" | "lot-size">(
    "recommended"
  )
  const [loading, setLoading] = useState(false)

  // Normalize listing data
  const normalizeListing = (listing: any): Listing => {
    const coords =
      listing.coords ||
      (listing.latitude && listing.longitude
        ? { lng: Number(listing.longitude), lat: Number(listing.latitude) }
        : undefined)

    let images = listing.images
    if (!Array.isArray(images)) {
      images = typeof images === "string" ? [images] : []
    }

    // Normalize price from backend array to number
    const price =
  typeof listing.price === "number"
    ? listing.price
    : 0
    // Normalize amenities to array of strings
    const amenities = listing.amenities?.map((a: Amenity) => a.name) || []

    return {
      ...listing,
      coords,
      images,
      price,
      amenities,
    }
  }

  // Fetch rentals (all or filtered)
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const apiFilters: Record<string, any> = {}

        // Map frontend filters to backend query parameters
        if (filters?.category) apiFilters.category = filters.category
        if (filters?.propertyType && filters.propertyType !== "All types")
          apiFilters.propertyType = filters.propertyType
        if (filters?.price) {
          apiFilters.price = { min: filters.price.min, max: filters.price.max }
        }
        if (filters?.beds && filters.beds !== "Any") {
          apiFilters.beds = Number(filters.beds.replace("+", ""))
        }
        if (filters?.baths && filters.baths !== "Any") {
          apiFilters.baths = Number(filters.baths.replace("+", ""))
        }
        if (filters?.moreOptions) {
          if (filters.moreOptions.selectedPets?.length) apiFilters.selectedPets = filters.moreOptions.selectedPets
          if (filters.moreOptions.keywords) apiFilters.keywords = filters.moreOptions.keywords
        }
        if (searchLocation) apiFilters.searchLocation = searchLocation

        console.log("Fetching rentals with filters:", apiFilters)

        const response = await getRentals(apiFilters)
        if (!mounted) return

        const normalizedData = (Array.isArray(response.data) ? response.data : []).map(normalizeListing)

        setAllListings(normalizedData)
        setFilteredListings(normalizedData)
      } catch (e) {
        console.error("Failed to fetch rentals:", e)
        if (mounted) setFilteredListings([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [filters, searchLocation])

  // Sort filtered listings
  const sortedListings = useMemo(() => {
    const results = [...filteredListings]
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
  }, [filteredListings, sortBy])

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing)
    setIsDetailsOpen(true)
  }

  const listingCount = sortedListings.length

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
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-48 text-primary font-semibold text-sm cursor-pointer px-3 py-2 border border-primary rounded-md bg-white"
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
        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Loading...</p>
        ) : sortedListings.length > 0 ? (
          sortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={isFavorited(listing.id)}
              onFavoriteToggle={() => toggleFavorite(listing.id)}
              onViewDetails={() => handleViewDetails(listing)}
              onLocationClick={() => {
                if (listing.coords?.lng && listing.coords?.lat) {
                  onLocationClick?.({ lng: Number(listing.coords.lng), lat: Number(listing.coords.lat) }, listing.address)
                }
              }}
            />
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p>No listings found {searchLocation ? `for "${searchLocation}"` : ""}</p>
            <p className="text-xs mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={isFavorited(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
    </div>
  )
}
