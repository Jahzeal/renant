"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useFavorites } from "@/lib/favorites-context";
import ListingCard from "@/components/listing-card";
import ListingDetailsModal from "@/components/modal/listing-details-modal";
import PageHeader from "@/components/page-header";
import { getRentals } from "@/lib/getRentals-api";

export default function SavedHomesPage() {
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const [allListings, setAllListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all listings from backend
  useEffect(() => {
    let mounted = true;

    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await getRentals();
        if (!mounted) return;

        const listings = Array.isArray(res) ? res : res.data ?? [];
        setAllListings(listings);
      } catch (e) {
        console.error("Failed to fetch listings:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchListings();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter saved listings
  const savedListings = allListings.filter((listing) =>
    isFavorited(listing.id)
  );

  return (
    <>
      <PageHeader />

      <div className="flex flex-col bg-background h-[calc(100vh-64px)]">
        {/* Navigation */}
        <div className="border-b bg-white">
          <div className="w-full px-3 sm:px-6">
            <div className="h-14 sm:h-16 flex items-center">
              <nav
                className="
          flex flex-nowrap gap-4 sm:gap-6
          overflow-x-auto
          scrollbar-hide
          text-xs sm:text-sm
          flex-1
        "
              >
                <Link
                  href="/saved-homes"
                  className="pb-3 sm:pb-4 border-b-2 border-primary text-primary font-medium whitespace-nowrap"
                >
                  Saved homes
                </Link>

                <Link
                  href="/manage-tours"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Manage tours
                </Link>

                <Link
                  href="/renter-hub"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Renter Hub
                </Link>

                <Link
                  href="/account-settings"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Account settings
                </Link>

                <Link
                  href="/how-it-works"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  How it works
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
              Saved homes
            </h1>

            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading saved homes...
              </p>
            ) : savedListings.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {savedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      amenities:
                        listing.amenities?.map((a: any) => a.name) || [],
                    }}
                    isFavorited={isFavorited(listing.id)}
                    onFavoriteToggle={() => toggleFavorite(listing.id)}
                    onViewDetails={() => setSelectedListing(listing)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
                <div className="mb-6 sm:mb-8">
                  {/* House SVG illustration */}
                  <svg
                    viewBox="0 0 300 200"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <rect
                        x="20"
                        y="90"
                        width="50"
                        height="60"
                        fill="#E3F2FD"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                      <polygon
                        points="20,90 45,50 70,90"
                        fill="#1E88E5"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                      <rect
                        x="28"
                        y="100"
                        width="14"
                        height="16"
                        fill="#FFC107"
                        stroke="#1E88E5"
                        strokeWidth="1"
                      />
                      <rect
                        x="48"
                        y="100"
                        width="14"
                        height="16"
                        fill="#FFC107"
                        stroke="#1E88E5"
                        strokeWidth="1"
                      />
                      <rect
                        x="35"
                        y="125"
                        width="20"
                        height="25"
                        fill="#90CAF9"
                        stroke="#1E88E5"
                        strokeWidth="1"
                      />
                      <rect
                        x="100"
                        y="70"
                        width="50"
                        height="80"
                        fill="#E3F2FD"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                      <polygon
                        points="100,70 125,30 150,70"
                        fill="#1E88E5"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                      <rect
                        x="180"
                        y="95"
                        width="50"
                        height="55"
                        fill="#E3F2FD"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                      <polygon
                        points="180,95 205,55 230,95"
                        fill="#1E88E5"
                        stroke="#1E88E5"
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 text-center">
                  Save homes for safe keeping.
                </h2>
                <p className="text-center text-muted-foreground mb-6 sm:mb-8 max-w-sm text-sm sm:text-base">
                  Whenever you find homes you like, select the{" "}
                  <span className="text-red-500">♥</span> to save them here.
                </p>
                <Link
                  href="/rentals"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-primary/90 transition"
                >
                  Search for homes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedListing && (
        <ListingDetailsModal
          listing={{
            ...selectedListing,
            amenities: selectedListing.amenities?.map((a: any) => a.name) || [],
            price: `₦${selectedListing.price}`,
          }}
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          isFavorited={isFavorited(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
    </>
  );
}
