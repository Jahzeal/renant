"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useFavorites } from "@/lib/favorites-context"
import ListingCard from "./listing-card"
import ListingDetailsModal from "./modal/listing-details-modal"
import { getRentals } from "@/lib/getRentals-api"
import type { MoreOptionsFilters } from "./modal/more-options-modal"
import { Loader2, AlertCircle } from "lucide-react"

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
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "newest" | "lot-size">(
    "recommended"
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    hasNextPage: false,
    total: 0
  })

  // To prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null)

  // Normalize listing data
  const normalizeListing = useCallback((listing: any): Listing => {
    const coords =
      listing.coords ||
      (listing.latitude && listing.longitude
        ? { lng: Number(listing.longitude), lat: Number(listing.latitude) }
        : undefined)

    let images = listing.images
    if (!Array.isArray(images)) {
      images = typeof images === "string" ? [images] : []
    }

    // Normalize price from backend (price or rent)
    // The backend might return 'price' or 'rent'
    let rawPrice = listing.price !== undefined ? listing.price : listing.rent

    // Handle price being a JSON array (from backend filtering logic)
    if (Array.isArray(rawPrice) && rawPrice.length > 0) {
      // Find the first price entry
      const priceEntry = rawPrice.find((item: any) => item && typeof item.price === "number");
      if (priceEntry) {
        rawPrice = priceEntry.price;
      }
    }

    const price = typeof rawPrice === "number" ? rawPrice : 0

    // Normalize beds/baths (bedrooms/bathrooms or beds/baths)
    const beds = listing.bedrooms !== undefined ? listing.bedrooms : (listing.beds || 0)
    const baths = listing.bathrooms !== undefined ? listing.bathrooms : (listing.baths || 0)

    // Normalize amenities to array of strings
    const amenities = listing.amenities?.map((a: Amenity) => a.name) || []

    return {
      ...listing,
      coords,
      images,
      price,
      beds,
      baths,
      amenities,
    }
  }, [])

  // Function to fetch listings
  const fetchListings = async (pageToFetch: number, shouldAppend: boolean) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const apiFilters: Record<string, any> = {
        // Only send page/limit if strictly necessary to avoid potential string/number parsing issues on backend defaults
      }

      // If page > 1, we must send it. If page == 1, backend default is 1, so safe to omit.
      if (pageToFetch > 1) {
        apiFilters.page = pageToFetch
      }
      // Rely on backend default limit of 12 for initial load

      // Map frontend filters to backend query parameters
      if (filters?.category) apiFilters.category = filters.category
      if (filters?.propertyType && filters.propertyType !== "All types")
        apiFilters.propertyType = filters.propertyType

      if (filters?.price) {
        // Some backends expect 'price', some 'minPrice'/'maxPrice'
        // Keeping nested object structure as per getRentals-api
        apiFilters.price = { min: filters.price.min, max: filters.price.max }
      }

      if (filters?.beds && filters.beds !== "Any") {
        // Map 'beds' to 'bedrooms' which is likely what the backend expects
        const bedsVal = Number(filters.beds.replace("+", ""))
        apiFilters.bedrooms = bedsVal
      }

      if (filters?.baths && filters.baths !== "Any") {
        // Map 'baths' to 'bathrooms'
        const bathsVal = Number(filters.baths.replace("+", ""))
        apiFilters.bathrooms = bathsVal
      }

      // Use nested moreOptions object to match backend DTO structure
      const moreOptions: Record<string, any> = {}
      if (filters?.moreOptions) {
        if (filters.moreOptions.selectedPets?.length) moreOptions.selectedPets = filters.moreOptions.selectedPets
        if (filters.moreOptions.keywords) moreOptions.keywords = filters.moreOptions.keywords
      }

      // "Strip search": If searchLocation exists, use it for keywords too (if not already set)
      // This enables finding listings by title/description matching the search term
      // We also strictly pass it to searchLocation to ensure fallback coverage
      if (searchLocation && !moreOptions.keywords) {
        moreOptions.keywords = searchLocation
      }

      if (Object.keys(moreOptions).length > 0) {
        apiFilters.moreOptions = moreOptions
      }

      if (searchLocation) {
        apiFilters.searchLocation = searchLocation
      }

      console.log(`Fetching rentals (page ${pageToFetch}) with filters:`, apiFilters)

      const response = await getRentals(apiFilters)

      // If aborted, do nothing
      if (controller.signal.aborted) return

      let rawData = []
      let meta = { page: pageToFetch, limit: 12, total: 0, hasNextPage: false }

      // Handle response structure ( { data: [], meta: {} } vs [] )
      if (response && Array.isArray(response.data)) {
        rawData = response.data
        if (response.meta) {
          meta = response.meta
        }
      } else if (Array.isArray(response)) {
        rawData = response
      } else if (response === undefined || response === null) {
        // This likely means getRentals returned nothing due to error
         throw new Error("No response from server")
      }

      let normalizedData = rawData.map(normalizeListing)

      // Client-side price filtering (strict fallback)
      if (filters?.price) {
        const { min, max } = filters.price;
        normalizedData = normalizedData.filter((listing: Listing) => {
          // If max is effectively infinite, treat it as such
          const effectiveMax = max === Number.POSITIVE_INFINITY ? Number.MAX_SAFE_INTEGER : max;
          return listing.price >= min && listing.price <= effectiveMax;
        });
      }

      if (shouldAppend) {
        setAllListings((prev) => [...prev, ...normalizedData])
      } else {
        setAllListings(normalizedData)
      }

      setPagination({
        page: meta.page,
        limit: meta.limit,
        hasNextPage: meta.hasNextPage,
        total: meta.total
      })

    } catch (e: any) {
      if (controller.signal.aborted) return
      console.error("Failed to fetch rentals:", e)
      setError(e.message || "Failed to load listings")
      if (!shouldAppend) setAllListings([])
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Initial fetch or filter change
  useEffect(() => {
    // Reset to page 1
    fetchListings(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchLocation])

  const handleLoadMore = () => {
    if (!loading && pagination.hasNextPage) {
      fetchListings(pagination.page + 1, true)
    }
  }

  const handleRetry = () => {
    fetchListings(1, false)
  }

  // Sort listings (Client-side sorting of the *fetched* listings)
  const sortedListings = useMemo(() => {
    const results = [...allListings]
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
  }, [allListings, sortBy])

  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing)
    setIsDetailsOpen(true)
  }

  // Calculate total count to display (use meta.total if available, else loaded count)
  const displayCount = pagination.total || sortedListings.length

  return (
    <div className="bg-white w-full lg:h-full flex flex-col">
      {/* Header */}
      <div className="relative lg:sticky lg:top-0 bg-white border-b p-4 sm:p-6 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="text-xl sm:text-4xl font-bold">Rental Listings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchLocation
                ? `${displayCount} rental${displayCount === 1 ? "" : "s"} found in ${searchLocation}`
                : `${displayCount} rentals available`}
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
      <div className="lg:flex-1 divide-y lg:overflow-y-auto">
        {loading && pagination.page === 1 ? (
          <div className="p-12 flex justify-center items-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="p-12 flex flex-col justify-center items-center text-center">
             <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
             <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
             <p className="text-muted-foreground mb-6">{error}</p>
             <button
               onClick={handleRetry}
               className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
             >
               Try Again
             </button>
           </div>
        ) : sortedListings.length > 0 ? (
          <>
            {sortedListings.map((listing) => (
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
            ))}

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="p-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Listings"
                  )}
                </button>
              </div>
            )}
          </>
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
