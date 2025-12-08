// app/p2p/buy/page.tsx
"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import HostelCard from "@/components/HostelCard";
import PriceRangeModal from "@/components/modal/price-range-modal";
import { useListingsStore } from "@/lib/listing-store";

export default function Buying() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPriceModalOpen, setIsPriceModalOpen] = React.useState(false);

  const { listings } = useListingsStore();
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);

  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.isActive)
      .filter((l) => {
        if (minPrice !== null && l.amount < minPrice) return false;
        if (maxPrice !== null && l.amount > maxPrice) return false;
        return true;
      });
  }, [listings, minPrice, maxPrice]);

  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min === 0 ? null : min);
    setMaxPrice(max === Number.POSITIVE_INFINITY ? null : max);
  };

  const isBuyActive = pathname.includes("/buy");

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-extrabold text-primary">Buyers</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-6">
             

                <div className="relative inline-flex items-center bg-muted rounded-full p-1 mb-8 w-full">
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-1/2 bg-primary rounded-full transition-all duration-300 ${
                      isBuyActive ? "translate-x-0" : "translate-x-full"
                    }`}
                  />
                  <button
                    onClick={() => router.push("/buyer")}
                    className="relative z-10 flex-1 py-3 text-sm font-semibold"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => router.push("/seller")}
                    className="relative z-10 flex-1 py-3 text-sm font-semibold"
                  >
                    Sell
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-5">Filters</h3>
                <button
                  onClick={() => setIsPriceModalOpen(true)}
                  className="w-full text-left p-5 bg-muted/50 border border-border rounded-xl hover:bg-muted transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-foreground">Price Range</p>
                    <p className="text-sm text-muted-foreground">Any price</p>
                  </div>
                  <span className="text-muted-foreground text-sm">Edit</span>
                </button>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                  Available Hostel Listings
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredListings.length} listings
                </span>
              </div>

              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredListings.map((listing) => (
                    <HostelCard
                      key={listing.id}
                      hostelName={listing.hostelName}
                      price={listing.price}
                      address={listing.address}
                      name={listing.name}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-card rounded-2xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground text-lg">
                    No active listings right now.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>

        <PriceRangeModal
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
          onApply={handleApplyPrice}
        />
      </div>
    </>
  );
}