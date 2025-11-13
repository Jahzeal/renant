"use client"

import { Heart } from "lucide-react"

interface ListingCardProps {
  listing: {
    id: string
    image: string
    title: string
    address: string
    price: number
    bedrooms: number
    style: string
    offer: string | null
    prices: { beds: number; price: number }[]
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="p-4 sm:p-6 hover:bg-muted/30 transition-colors cursor-pointer">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 group">
          <img
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white text-foreground text-xs font-semibold rounded">{listing.style}</span>
            {listing.offer && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                {listing.offer}
              </span>
            )}
          </div>

          {/* Heart button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition-colors">
            <Heart size={20} className="text-foreground" />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1">
          {/* Title and Address */}
          <h3 className="font-semibold text-foreground text-base mb-1">
            ${listing.price}+ {listing.bedrooms} bd
          </h3>
          <p className="text-foreground font-medium mb-1">{listing.title}</p>
          <p className="text-muted-foreground text-sm mb-4">{listing.address}</p>

          {/* Price breakdown */}
          <div className="flex flex-wrap gap-2">
            {listing.prices.map((priceOption) => (
              <div key={priceOption.beds} className="flex items-center gap-2">
                <div className="px-3 py-2 border border-border rounded text-center">
                  <div className="text-primary font-semibold text-sm">${priceOption.price}+</div>
                  <div className="text-muted-foreground text-xs">{priceOption.beds} bd</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
