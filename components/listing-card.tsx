"use client"

import type React from "react"
import { useState } from "react"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"

interface Listing {
  id: string
  images?: string[]
  image?: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms?: number
  style: string
  offer: string | null
  prices: { beds: number; price: number }[]
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
}

export default function ListingCard({
  listing,
  isFavorited = false,
  onFavoriteToggle,
  onViewDetails,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = listing.images || (listing.image ? [listing.image] : ["/cozy-cabin-interior.png"])

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
    console.log("[v0] Heart clicked, isFavorited before:", isFavorited)
    onFavoriteToggle?.()
    console.log("[v0] toggleFavorite called for listing:", listing.id)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 hover:bg-muted/30 transition-colors rounded-lg cursor-pointer border-b">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64 h-56 sm:h-48 rounded-lg overflow-hidden bg-gray-200 group flex-shrink-0">
          <img
            src={images[currentImageIndex] || "/placeholder.svg?height=300&width=400&query=home"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white text-xs font-semibold rounded shadow">{listing.style}</span>
            {listing.offer && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded shadow">
                {listing.offer}
              </span>
            )}
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition-colors shadow z-10"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : "text-foreground"} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base md:text-lg text-foreground mb-1">
            ${listing.price}+ • {listing.bedrooms} bd
          </h3>
          <p className="text-foreground font-medium text-sm md:text-base mb-1">{listing.title}</p>
          <p className="text-muted-foreground text-xs md:text-sm mb-3">{listing.address}</p>
          <div className="flex flex-wrap gap-2">
            {listing.prices.map((p) => (
              <div key={p.beds} className="px-3 py-2 border border-border rounded text-center">
                <div className="text-primary font-semibold text-sm">${p.price}+</div>
                <div className="text-muted-foreground text-xs">{p.beds} bd</div>
              </div>
            ))}
          </div>
          {onViewDetails && (
            <button onClick={onViewDetails} className="mt-3 text-primary font-semibold text-sm hover:underline">
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
