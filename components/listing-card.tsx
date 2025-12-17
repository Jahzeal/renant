"use client"

import type React from "react"
import { useState } from "react"
import { Heart, ChevronLeft, ChevronRight, MapPin, Bed, Bath, LayoutGrid } from "lucide-react" // Added MapPin, Bed, Bath, LayoutGrid for icons

interface Listing {
  id: string
  images?: string[]
  image?: string
  title: string
  address: string
  price: number
  beds: number
  baths?: number
  style: string
  offers: string | null
  prices?: { beds: number; price: number }[]
  location?: string
  type?: string
  description?: string
  amenities?: string[]
}

interface ListingCardProps {
  listing: Listing
  isFavorited?: boolean
  onFavoriteToggle?: () => void
  onViewDetails?: () => void
  onLocationClick?: () => void
}

export default function ListingCard({
  listing,
  isFavorited = false,
  onFavoriteToggle,
  onViewDetails,
  onLocationClick,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = (() => {
    // Priority 1: images array
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images
    }
    // Priority 2: single image field
    if (listing.image) {
      return [listing.image]
    }
    // Priority 3: placeholder with listing info
    return [`/placeholder.svg?height=400&width=600&query=${encodeURIComponent(listing.title || "property")}`]
  })()

  console.log("[v0] ListingCard rendering with images:", {
    listingId: listing.id,
    title: listing.title,
    rawImages: listing.images,
    rawImage: listing.image,
    finalImages: images,
    currentIndex: currentImageIndex,
  })

  const prices = listing.prices || []
  const amenities = listing.amenities || []

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteToggle?.()
  }

  const handleCardClick = () => {
    onViewDetails?.()
  }

  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] ListingCard location clicked for:", listing.id, listing.title)
    onLocationClick?.()
  }

  // Helper for formatting large numbers
  const formatPrice = (price: number) => new Intl.NumberFormat("en-US").format(price)

  return (
    <div
      className="p-3 sm:p-4 md:p-6 hover:bg-muted/30 transition-colors rounded-lg cursor-pointer border-b"
      onClick={handleCardClick}
      // *** FIX: Added style to hide horizontal overflow within the card container itself ***
      style={{ overflowX: "hidden" }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {" "}
        {/* Increased gap for separation */}
        {/* IMAGE SECTION (Kept the same) */}
        <div className="relative w-full sm:w-64 h-56 sm:h-48 rounded-xl overflow-hidden bg-gray-200 group flex-shrink-0 shadow-md">
          {" "}
          {/* Added rounded-xl and shadow */}
          <img
            src={images[currentImageIndex] || "/placeholder.svg?height=300&width=400&query=home"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Labels */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-10">
            {/* <span className="px-3 py-1 bg-white text-xs font-semibold rounded-full shadow-lg">
              {" "}
              {/* Pill shape for style */}
            {listing.style}
            {/* </span>  */}
            {listing.offers && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
                {" "}
                {/* Pill shape for offers */}
                {listing.offers}
              </span>
            )}
          </div>
          {/* Favorite */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg z-10"
          >
            <Heart
              size={20}
              className={
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500" // Subtle default color
              }
            />
          </button>
          {/* Image navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>
        {/* TEXT SECTION */}
        <div className="flex-1">
          {/* Main Price and Bedrooms/Bathrooms - HIGHLIGHTED */}
          <h3 className="font-bold text-xl md:text-2xl text-primary mb-1 leading-snug">
            ₦{formatPrice(listing.price)}+
            <span className="ml-3 text-lg font-semibold text-foreground/80">• {listing.beds} bd</span>
          </h3>

          {/* Listing Title - Sub-highlighted */}
          <p className="text-foreground font-semibold text-base md:text-lg mb-2">{listing.title}</p>

          {/* Address (Location) - Styled with Icon */}
          <p
            onClick={handleLocationClick}
            className="text-sm text-gray-600 hover:text-primary hover:underline transition-colors cursor-pointer flex items-center mb-4"
          >
            <MapPin size={14} className="mr-1.5 text-primary" />
            <span className="font-medium">{listing.address}</span>
          </p>

          <div className="space-y-4">
            {/* Type / Beds / Baths - Grouped and Cleaned up */}
            <div className="flex items-center space-x-6 text-sm">
              {listing.type && (
                <div className="flex items-center text-muted-foreground">
                  <LayoutGrid size={16} className="mr-1.5 text-primary/70" />
                  <span className="font-normal mr-1">Type:</span>
                  <span className="text-foreground font-medium">{listing.type}</span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Bed size={16} className="mr-1.5 text-primary/70" />
                <span className="font-normal mr-1">Beds:</span>
                <span className="text-foreground font-medium">{listing.beds}</span>
              </div>
              {listing.baths && (
                <div className="flex items-center text-muted-foreground">
                  <Bath size={16} className="mr-1.5 text-primary/70" />
                  <span className="font-normal mr-1">Baths:</span>
                  <span className="text-foreground font-medium">{listing.baths}</span>
                </div>
              )}
            </div>

            {/* Description - Styled as a call-out box */}
            {listing.description && (
              <div className="pt-2">
                <p className="text-xs md:text-sm text-gray-700  border-l-4 border-primary/50 pl-3 bg-primary/5 p-2 rounded-r-md ">
                  {listing.description.length > 150
                    ? listing.description.slice(0, 150) + "..." // Increased slice length
                    : listing.description}
                </p>
              </div>
            )}

            {/* Price options - More subtle chips */}
            {prices.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {prices.map((p) => (
                  <div
                    key={p.beds}
                    className="px-3 py-1.5 border border-primary/20 bg-primary/5 rounded-lg text-center transition-colors hover:bg-primary/10"
                  >
                    <div className="text-primary font-bold text-sm">₦{formatPrice(p.price)}+</div>
                    <div className="text-muted-foreground text-xs">{p.beds} bd</div>
                  </div>
                ))}
              </div>
            )}

            {/* Amenities - Distinctive pill styling */}
            {amenities.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-foreground mb-1.5">Key Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
