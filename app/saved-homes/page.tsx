"use client"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites-context"
import { SAMPLE_LISTINGS } from "@/lib/sample-listing"
import ListingCard from "@/components/listing-card"
import Header from "@/components/header"
import PageHeader from "@/components/page-header"

export default function SavedHomesPage() {
  const { favorites, toggleFavorite } = useFavorites()

  // Get the saved listings
  const savedListings = SAMPLE_LISTINGS.filter((listing) => favorites.includes(listing.id))

  return (
    <>
      <PageHeader />
      <div className="flex flex-col bg-background h-[calc(100vh-64px)]">
        {/* Header Navigation - made flex-shrink-0 to maintain height */}
        <div className="border-b flex-shrink-0">
          <div className="w-full px-2 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
              <nav className="flex gap-3 sm:gap-6 overflow-x-auto text-xs sm:text-sm flex-1">
                <Link
                  href="/saved-homes"
                  className="pb-2 sm:pb-4 border-b-2 border-primary text-primary font-medium whitespace-nowrap"
                >
                  Saved homes
                </Link>

                {/* <Link
                  href="#"
                  className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Saved search
                </Link> */}
                <Link
                  href="/account-settings"
                  className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Account settings
                </Link>
                {/* <Link
                  href="#"
                  className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Manage tours
                </Link> */}
              </nav>
              <div className="flex-shrink-0">
                <Link href="#" className="text-primary text-xs sm:text-sm font-medium hover:underline">
                  Hidden homes
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Saved homes</h1>

            {savedListings.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {savedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isFavorited={favorites.includes(listing.id)}
                    onFavoriteToggle={() => toggleFavorite(listing.id)}
                    onViewDetails={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
                <div className="mb-6 sm:mb-8">
                  <svg
                    viewBox="0 0 300 200"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* House illustration */}
                    <g opacity="0.8">
                      {/* Left house */}
                      <rect x="20" y="90" width="50" height="60" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" />
                      <polygon points="20,90 45,50 70,90" fill="#1E88E5" stroke="#1E88E5" strokeWidth="2" />
                      <rect x="28" y="100" width="14" height="16" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="48" y="100" width="14" height="16" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="35" y="125" width="20" height="25" fill="#90CAF9" stroke="#1E88E5" strokeWidth="1" />

                      {/* Middle building */}
                      <rect x="100" y="70" width="50" height="80" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" />
                      <polygon points="100,70 125,30 150,70" fill="#1E88E5" stroke="#1E88E5" strokeWidth="2" />
                      {/* Windows */}
                      <rect x="108" y="80" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="128" y="80" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="108" y="100" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="128" y="100" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="108" y="120" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="128" y="120" width="12" height="12" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />

                      {/* Right house */}
                      <rect x="180" y="95" width="50" height="55" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" />
                      <polygon points="180,95 205,55 230,95" fill="#1E88E5" stroke="#1E88E5" strokeWidth="2" />
                      <rect x="188" y="105" width="12" height="14" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="208" y="105" width="12" height="14" fill="#FFC107" stroke="#1E88E5" strokeWidth="1" />
                      <rect x="196" y="130" width="16" height="20" fill="#90CAF9" stroke="#1E88E5" strokeWidth="1" />
                    </g>
                  </svg>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 text-center">
                  Save homes for safe keeping.
                </h2>
                <p className="text-center text-muted-foreground mb-6 sm:mb-8 max-w-sm text-sm sm:text-base">
                  Whenever you find homes you like, select the <span className="text-red-500">♥</span> to save them
                  here.
                </p>

                <Link
                  href="/"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-primary/90 transition"
                >
                  Search for homes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
