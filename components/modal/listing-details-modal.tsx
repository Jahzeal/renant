"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { RequestTourModal } from "./request-tour-modal";
import { RequestToApplyModal } from "./request-to-apply-modal";
import Map from "@/components/map";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingDetailsModalProps {
  listing: {
    id: string | number;
    title: string;
    location: string;
    price: string | number;
    beds: number;
    baths?: number;
    roomType?: string;
    images: string[];
    description?: string;
    amenities?: string[];
    type?: string;
    coords?: { lng: number; lat: number };
    propertyType?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

export default function ListingDetailsModal({
  listing,
  isOpen,
  onClose,
  isFavorited = false,
  onFavoriteToggle,
}: ListingDetailsModalProps) {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isMobile = useIsMobile();

  const [imageIndex, setImageIndex] = useState(0);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const normalizedPropertyType: "apartment" | "hostel" | "shortlet" =
    listing.type?.toLowerCase() === "shortlet"
      ? "shortlet"
      : listing.type?.toLowerCase() === "hostel"
      ? "hostel"
      : "apartment";

  if (!isOpen) return null;

  const requireAuth = (openModal: () => void) => {
    if (!user) {
      router.push("/signin");
      return;
    }
    openModal();
  };

  const nextImage = () => setImageIndex((i) => (i + 1) % listing.images.length);

  const prevImage = () =>
    setImageIndex((i) => (i === 0 ? listing.images.length - 1 : i - 1));

  const handleFavorite = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    onFavoriteToggle?.();
  };

  const handleBookNow = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    onClose();
    router.push(`/booking/${listing.id}`);
  };

  const isShortlet = listing.type === "ShortLET";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Images */}
            <div className="relative h-80 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={listing.images[imageIndex] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={handleFavorite}
                className="absolute top-4 right-4 bg-white p-2 rounded-full"
              >
                <Heart
                  size={20}
                  className={isFavorited ? "fill-red-500 text-red-500" : ""}
                />
              </button>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-2xl font-bold">{listing.price}</h3>
              <p className="text-muted-foreground">
                {listing.beds} beds
                {listing.baths && ` • ${listing.baths} baths`}
                {listing.roomType && ` • ${listing.roomType}`}
              </p>
              <p className="text-muted-foreground">{listing.location}</p>
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {listing.amenities?.length ? (
              <div>
                <h4 className="font-semibold mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {listing.amenities.map((a) => (
                    <span key={a} className="text-sm text-muted-foreground">
                      • {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {isMobile && listing.coords && (
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <Map
                  coords={listing.coords}
                  locationName={listing.location}
                  height="250px"
                  zoom={15}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isShortlet ? (
                <>
                  <button
                    onClick={() => requireAuth(() => setShowApplyModal(true))}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Request to apply
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Book now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => requireAuth(() => setShowTourModal(true))}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Send tour request
                  </button>
                  <button
                    onClick={() => requireAuth(() => setShowApplyModal(true))}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Request to apply
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestTourModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        listingId={String(listing.id)}
        listingTitle={listing.title}
        propertyType={normalizedPropertyType}
        onSuccess={() => {
          setShowTourModal(false);
          onClose(); // close listing modal
          router.push("/manage-tours");
        }}
      />

      <RequestToApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        listingId={String(listing.id)}
        listingTitle={listing.title}
        listingPrice={Number(listing.price)}
      />
    </>
  );
}
