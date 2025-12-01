"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth" // Import useAuth
import { useRouter } from "next/navigation" // Import useRouter
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { RequestTourModal } from "./request-tour-modal"
import { RequestToApplyModal } from "./request-to-apply-modal"


// Define the type for the listing details (used in props)
interface ListingDetailsModalProps {
  listing: {
    id: string | number
    title: string
    location: string
    price: string | number
    beds: number
    baths?: number
    images: string[]
    description?: string
    amenities?: string[]
    agent?: {
      name: string
      company: string
      phone: string
    }
  }
  isOpen: boolean
  onClose: () => void
  isFavorited?: boolean
  onFavoriteToggle?: () => void
}

export default function ListingDetailsModal({
  listing,
  isOpen,
  onClose,
  isFavorited = false,
  onFavoriteToggle,
}: ListingDetailsModalProps) {
  // --- State Management ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showTourModal, setShowTourModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)

  // --- Hooks ---
  const router = useRouter()
  
  // ✅ FIX: Use a direct selector to get the 'user' object from the store.
  // This is the standard best practice for Zustand/Redux and avoids the
  // re-render/call stack issue caused by creating a new temporary object
  // on every render (which the previous line of code was doing).
  const user = useAuth((state) => state.user);
  
  // Return null if the modal is closed
  if (!isOpen) return null

  // --- Image Navigation Handlers ---

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  // --- Protected Action Handlers ---

  /**
   * Checks if the user is authenticated. If not, redirects to signin.
   * If yes, opens the specified modal.
   */
  const handleProtectedAction = (setModalState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!user) {
      router.push("/signin")
    } else {
      setModalState(true)
    }
  }
  
  /**
   * Handles the favorite click, requiring authentication first.
   */
  const handleFavoriteClick = () => {
    if (!user) {
      router.push("/signin")
    } else if (onFavoriteToggle) {
      onFavoriteToggle()
    }
  }

  // --- Render ---

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Image Slider Section */}
            <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-200 group">
              <img
                src={listing.images[currentImageIndex] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
              >
                <ChevronRight size={20} />
              </button>

              {/* Favorite Button (Uses Protected Handler) */}
              <button
                onClick={handleFavoriteClick} 
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-muted"
              >
                <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* Price and Basic Info Section */}
            <div>
              <h3 className="text-2xl font-bold">${listing.price}</h3>
              <p className="text-muted-foreground">
                {listing.beds} beds {listing.baths ? `• ${listing.baths} baths` : ""}
              </p>
              <p className="text-muted-foreground">{listing.location}</p>
            </div>

            {/* Description Section */}
            {listing.description && (
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{listing.description}</p>
              </div>
            )}

            {/* Amenities Section */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="text-sm text-muted-foreground">
                      • {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (Uses Protected Handler) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => handleProtectedAction(setShowTourModal)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Send tour request
              </button>
              <button
                onClick={() => handleProtectedAction(setShowApplyModal)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Request to apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestTourModal isOpen={showTourModal} onClose={() => setShowTourModal(false)} listingTitle={listing.title}listingId={String(listing.id)} />
      <RequestToApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        listingTitle={listing.title}
        listingId={String(listing.id)}
        listingPrice={Number(listing.price)}
        agent={listing.agent}
      />
    </>
  )
}
