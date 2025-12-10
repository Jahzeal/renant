// components/HostelSellCard.tsx
import React from "react"
import { X } from "lucide-react"

interface HostelSellCardProps {
  hostelName: string
  price: string
  address: string
  isActive: boolean
  images?: string[]
  onEdit: () => void
  onDelete: () => void
}

const HostelSellCard: React.FC<HostelSellCardProps> = ({
  hostelName,
  price,
  address,
  isActive,
  images = [],
  onEdit,
  onDelete,
}) => {
  const mainImage = images[0]

  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={hostelName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">No Image</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
            isActive
              ? "bg-emerald-500 text-white"
              : "bg-gray-400 text-white"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Image Count */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur">
            +{images.length - 1} more
          </div>
        )}
      </div>

      <div className="relative p-6">
        <h3 className="text-xl font-extrabold text-foreground mb-2">{hostelName}</h3>
        <p className="text-3xl font-bold text-primary mb-1">{price}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{address}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1 py-3 bg-red-500/10 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-500/20 transition"
          >
            Delete
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

export default HostelSellCard