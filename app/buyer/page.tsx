"use client";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import HostelCard from "./HostelCard";
import PriceRangeModal from "@/components/modal/price-range-modal";
import { useListingsStore } from "@/lib/listing-store";
import Link from "next/link";

export default function Buying() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const { listings } = useListingsStore();

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    setRating(4.7 + Math.random() * 0.3);
    setReviewCount(Math.floor(Math.random() * 100) + 20);
  }, []);

  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.isActive)
      .filter((l) => !["demo-1", "demo-2"].includes(l.id))
      .filter((l) => {
        if (minPrice !== null && l.amount < minPrice) return false;
        if (maxPrice !== null && l.amount > maxPrice) return false;
        return true;
      })
      .sort((a, b) => b.amount - a.amount);
  }, [listings, minPrice, maxPrice]);

  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min || null);
    setMaxPrice(max < Number.POSITIVE_INFINITY ? max : null);
    setIsPriceModalOpen(false);
  };

  const isBuyActive = pathname.includes("/buyer");
  const hasActiveFilter = minPrice !== null || maxPrice !== null;
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Top Row: Logo & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Escrow
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Buy Properties
                  </p>
                </div>
              </div>

              {/* Buy/Sell Toggle + Links */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative inline-flex bg-muted rounded-full p-1 shadow-sm border border-border">
                  <div
                    className={`absolute inset-y-1 left-1 w-[calc(50%-2px)] bg-primary rounded-full transition-all duration-300 ease-out shadow-md ${
                      isBuyActive ? "translate-x-0" : "translate-x-full"
                    }`}
                  />
                  <button
                    onClick={() => router.push("/buyer")}
                    className={`relative z-10 px-5 py-2 text-sm font-semibold transition-all rounded-full ${
                      isBuyActive ? "text-white" : "text-foreground"
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => router.push("/seller")}
                    className={`relative z-10 px-5 py-2 text-sm font-semibold transition-all rounded-full ${
                      !isBuyActive ? "text-white" : "text-foreground"
                    }`}
                  >
                    Sell
                  </button>
                </div>
                <Link
                  href="/how-it-works"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-accent transition-colors hover:bg-primary/5 rounded-lg"
                >
                  How Enscroll Works
                </Link>
              </div>
            </div>

            {/* Bottom Row: Filter & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Available Properties
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredListings.length}{" "}
                  {filteredListings.length === 1 ? "property" : "properties"}{" "}
                  available
                </p>
              </div>

              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="flex sm:hidden items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {hasActiveFilter && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 text-xs rounded-full font-bold">
                    1
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-xl hover:bg-muted transition-colors font-semibold text-foreground shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter by Price
                {hasActiveFilter && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-bold">
                    1
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredListings.map((listing) => (
              <HostelCard
                key={`${listing.id}-${listing.amount}`}
                listingId={listing.id} // ✅ pass ID
                hostelName={listing.hostelName}
                price={`₦${listing.amount.toLocaleString()}`}
                address={listing.address}
                name={
                  listing.name === "You" ? "You (Your Listing)" : listing.name
                }
                images={listing.images || []}
                rating={rating ?? 4.7}
                reviewCount={reviewCount ?? 20}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border-2 border-dashed border-border">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-5xl">🔍</div>
              <p className="text-2xl font-bold text-foreground mb-3">
                No properties found
              </p>
              <p className="text-muted-foreground text-base mb-8">
                Try adjusting your filters or check back later for more listings
              </p>
              <button
                onClick={() => {
                  setMinPrice(null);
                  setMaxPrice(null);
                }}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </main>

      <PriceRangeModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onApply={handleApplyPrice}
      />
    </div>
  );
}
