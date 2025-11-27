"use client";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites-context";
import { SAMPLE_LISTINGS } from "@/lib/sample-listing";
import ListingCard from "@/components/listing-card";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/header";

export default function SavedHomesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const savedListings = SAMPLE_LISTINGS.filter((listing) =>
    favorites.includes(listing.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <nav className="flex gap-6 overflow-x-auto text-sm">
              <Link
                href="/saved-homes"
                className="pb-4 border-b-2 border-primary text-primary font-medium whitespace-nowrap"
              >
                Saved homes
              </Link>
              <Link
                href="/account-settings"
                className="pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Account settings
              </Link>
              <Link
                href="#"
                className="pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Recently Viewed
              </Link>
              <Link
                href="#"
                className="pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Manage Tours
              </Link>
             
            </nav>
            <div className="ml-auto">
              <Link
                href="#"
                className="text-primary text-sm font-medium hover:underline"
              >
                Hidden homes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Saved homes</h1>

        {savedListings.length > 0 ? (
          <div className="space-y-4">
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
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="mb-8">
              <svg
                viewBox="0 0 300 200"
                className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* House illustration */}
                <g opacity="0.8">
                  {/* Left house */}
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

                  {/* Middle building */}
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
                  {/* Windows */}
                  <rect
                    x="108"
                    y="80"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="128"
                    y="80"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="108"
                    y="100"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="128"
                    y="100"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="108"
                    y="120"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="128"
                    y="120"
                    width="12"
                    height="12"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />

                  {/* Right house */}
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
                  <rect
                    x="188"
                    y="105"
                    width="12"
                    height="14"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="208"
                    y="105"
                    width="12"
                    height="14"
                    fill="#FFC107"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                  <rect
                    x="196"
                    y="130"
                    width="16"
                    height="20"
                    fill="#90CAF9"
                    stroke="#1E88E5"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-center">
              Save homes for safe keeping.
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              Whenever you find homes you like, select the{" "}
              <span className="text-red-500">♥</span> to save them here.
            </p>

            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              Search for homes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
