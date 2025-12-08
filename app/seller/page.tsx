"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import HostelSellCard from "@/components/HostelSellCard";
import PostHostelModal from "@/components/modal/post-hostel-modal";
import { useListingsStore } from "@/lib/listing-store";

export default function Seller() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const { listings, addListing, removeListing } = useListingsStore();

  // Simulate current logged-in user (in real app, get from auth)
  const currentUserName = "You"; // Change this later with real auth

  // Filter only current user's active listings
  const myListings = listings.filter(
    (l) => l.name === currentUserName && l.isActive
  );

  const handlePostHostel = (data: {
    hostelName: string;
    price: string;
    address: string;
  }) => {
    addListing({
      hostelName: data.hostelName,
      price: `₦${Number(data.price).toLocaleString()}`,
      amount: Number(data.price),
      address: data.address,
      name: currentUserName, 
    });

    setIsPostModalOpen(false);
  };

  const isSellActive = pathname.includes("/seller");

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col py-4 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary text-center sm:text-left">
                Seller Dashboard
              </h1>

              <div className="relative inline-flex bg-muted rounded-full p-1 shadow-inner mx-auto sm:mx-0">
                <div
                  className={`absolute inset-y-1 left-1 w-1/2 bg-primary rounded-full transition-transform duration-300 ease-out ${
                    !isSellActive ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  onClick={() => router.push("/buyer")}
                  className={`relative z-10 px-6 py-2.5 text-sm font-bold transition-all ${
                    !isSellActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => router.push("/seller")}
                  className={`relative z-10 px-6 py-2.5 text-sm font-bold transition-all ${
                    isSellActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="sm:hidden flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition shadow-lg"
            >
              Post New Hostel
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
              Your Hostel Listings
            </h2>
            <p className="text-muted-foreground mt-1">
              {myListings.length} active{" "}
              {myListings.length === 1 ? "listing" : "listings"}
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="hidden sm:flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition shadow-lg"
          >
            Post New Hostel
          </button>
        </div>

        {myListings.length > 0 ? (
          <div className="space-y-6">
            {myListings.map((listing) => (
              <HostelSellCard
                key={listing.id}
                hostelName={listing.hostelName}
                price={listing.price}
                address={listing.address}
                isActive={listing.isActive}
                onEdit={() => alert("Edit feature coming soon!")}
                onDelete={() => {
                  if (confirm("Are you sure you want to delete this listing?")) {
                    removeListing(listing.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-border">
            <div className="max-w-md mx-auto">
              <p className="text-2xl font-bold text-foreground mb-4">
                No listings yet
              </p>
              <p className="text-muted-foreground mb-8">
                Start earning by posting your hostel for sale or rent
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition shadow-lg"
              >
                Post Your First Hostel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 sm:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Post hostel"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <PostHostelModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostHostel}
      />
    </div>
  );
}