"use client"

import { useState, useEffect, useMemo } from "react"
import { useFavorites } from "@/lib/favorites-context"
import ListingCard from "./listing-card"
import ListingDetailsModal from "./modal/listing-details-modal"
import { filterRentals, getRentals } from "@/lib/getRentals-api"
import type { MoreOptionsFilters } from "./modal/more-options-modal"

interface AppliedFilters {
  price: { min: number; max: number } | null
  roomType: string
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
  room_type: "room_self_contain" | "2_bedrooms" | "room_parlor" | "3_plus_bedrooms"
  style: string
  offers: string | null
  prices: { beds: number; price: number }[]
  location: string
  type: string
  description?: string
  amenities?: Amenity[]
  coords?: { lng: number; lat: number }
}

export default function ListingsPanel({ searchLocation = "", filters, onLocationClick }: ListingsPanelProps) {
  const { toggleFavorite, isFavorited } = useFavorites()

  const [allListings, setAllListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "newest" | "lot-size">("recommended")
  const [loading, setLoading] = useState(false)

  // Fetch all rentals
  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        const data = await getRentals()
        if (!mounted) return
        setAllListings(data)
        setFilteredListings(data)
      } catch (e) {
        console.error("Failed to load rentals:", e)
        if (mounted) setAllListings([])
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  // Apply filters
  useEffect(() => {
    if (!filters && !searchLocation) {
      setFilteredListings(allListings)
      return
    }

    let mounted = true
    const fetchFiltered = async () => {
      setLoading(true)
      try {
        const data = await filterRentals({
          propertyType: filters?.propertyType,
          price: filters?.price,
          roomType: filters?.roomType,
          searchLocation,
          moreOptions: filters?.moreOptions,
        })
        if (!mounted) return
        setFilteredListings(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error("Failed to fetch filtered rentals:", e)
        if (mounted) setFilteredListings([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchFiltered()
    return () => { mounted = false }
  }, [filters, searchLocation, allListings])

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
              listing={{
                ...listing,
                amenities: listing.amenities?.map(a => a.name) || [],
              }}
              isFavorited={isFavorited(listing.id)}
              onFavoriteToggle={() => toggleFavorite(listing.id)}
              onViewDetails={() => handleViewDetails(listing)}
              onLocationClick={() => {
                if (listing.coords) onLocationClick?.(listing.coords, listing.address)
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
            id: selectedListing.id,
            // id: Number(selectedListing.id),
            title: selectedListing.title,
            location: selectedListing.location,
            price: `₦${selectedListing.price}`,
            beds: selectedListing.beds,
            baths: selectedListing.baths,
            images: selectedListing.images,
            description: selectedListing.description,
            amenities: selectedListing.amenities?.map(a => a.name) || [],
            type: selectedListing.type,
          }}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={isFavorited(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
    </div>
  )
}
