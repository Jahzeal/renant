// app/p2p/sell/page.tsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import HostelSellCard from "@/components/HostelSellCard";
import PostHostelModal from "@/components/modal/post-hostel-modal";
import {useListingsStore} from "@/lib/listing-store";

export default function Seller() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);

  const { listings, addListing, removeListing } = useListingsStore();
  const myListings = listings; // All listings are yours for now

  const handlePostHostel = (data: { hostelName: string; price: string; address: string }) => {
    addListing({
      hostelName: data.hostelName,
      price: `₦${Number(data.price).toLocaleString()}`,
      amount: Number(data.price),
      address: data.address,
      name: "You",
    });
  };

  const isSellActive = pathname.includes("/sell");

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-extrabold text-primary">Sellers</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-6">
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full text-left mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition"
                >
                  <p className="font-semibold text-primary">Post Your Hostel for Sale</p>
                  <p className="text-sm text-primary/80 mt-1">Earn by listing your space</p>
                </button>

                <div className="relative inline-flex items-center bg-muted rounded-full p-1 mb-8 w-full">
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-1/2 bg-primary rounded-full transition-all duration-300 ${
                      isSellActive ? "translate-x-full" : "translate-x-0"
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
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                  Your Hostel Listings
                </h2>
                <span className="text-sm text-muted-foreground">
                  {myListings.length} active
                </span>
              </div>

              {myListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {myListings.map((listing) => (
                    <HostelSellCard
                      key={listing.id}
                      hostelName={listing.hostelName}
                      price={listing.price}
                      address={listing.address}
                      isActive={listing.isActive}
                      onView={() => alert(`Viewing ${listing.hostelName}`)}
                      onEdit={() => alert("Edit coming soon")}
                      onDelete={() => removeListing(listing.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-card rounded-2xl border-2 border-dashed border-border">
                  <p className="text-muted-foreground text-lg">
                    You haven't posted any hostels yet.
                  </p>
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="mt-6 text-primary font-semibold hover:underline"
                  >
                    Post your first listing
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        <PostHostelModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handlePostHostel}
        />
      </div>
    </>
  );
}