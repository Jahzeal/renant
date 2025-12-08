"use client";
import React, { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import HostelCard from "@/components/HostelCard";
import PriceRangeModal from "@/components/modal/price-range-modal";
import { useListingsStore } from "@/lib/listing-store";

export default function Buying() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const { listings } = useListingsStore();

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.isActive)
      .filter((l) => {
        if (minPrice !== null && l.amount < minPrice) return false;
        if (maxPrice !== null && l.amount > maxPrice) return false;
        return true;
      })
      .sort((a, b) => b.amount - a.amount); // Highest price first
  }, [listings, minPrice, maxPrice]);

  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min || null);
    setMaxPrice(max < Number.POSITIVE_INFINITY ? max : null);
    setIsPriceModalOpen(false);
  };

  const isBuyActive = pathname.includes("/buyer");

  const hasActiveFilter = minPrice !== null || maxPrice !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col py-4 gap-4">
            {/* Title + Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary text-center sm:text-left">
                Buyer Dashboard
              </h1>

              {/* Buy / Sell Toggle */}
              <div className="relative inline-flex bg-muted rounded-full p-1 shadow-inner mx-auto sm:mx-0">
                <div
                  className={`absolute inset-y-1 w-1/2 bg-primary rounded-full transition-transform duration-300 ease-out ${
                    isBuyActive ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  onClick={() => router.push("/buyer")}
                  className={`relative z-10 px-6 py-2.5 text-sm font-bold transition-all ${
                    isBuyActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => router.push("/seller")}
                  className={`relative z-10 px-6 py-2.5 text-sm font-bold transition-all ${
                    !isBuyActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsPriceModalOpen(true)}
              className="sm:hidden flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-muted/70 border border-border rounded-xl hover:bg-muted transition text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilter && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-bold">
                  1
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Filter Bar */}
        <div className="hidden sm:flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
            Available Hostel Listings
          </h2>
          <button
            onClick={() => setIsPriceModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-muted/70 border border-border rounded-xl hover:bg-muted transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by Price
            {hasActiveFilter && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-bold">
                1
              </span>
            )}
          </button>
        </div>

        {/* Mobile Title */}
        <h2 className="sm:hidden text-2xl font-extrabold text-foreground mb-6 text-center">
          Available Listings
        </h2>

        {/* Responsive Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredListings.map((listing) => (
              <HostelCard
                key={listing.id}
                hostelName={listing.hostelName}
                price={`₦${listing.amount.toLocaleString()}`} // assuming amount is number
                address={listing.address}
                name={listing.name === "You" ? "You (Your Listing)" : listing.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-border">
            <div className="max-w-md mx-auto">
              <p className="text-2xl font-bold text-foreground mb-3">
                No active listings
              </p>
              <p className="text-muted-foreground text-base">
                Be the first to post or check back later!
              </p>
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