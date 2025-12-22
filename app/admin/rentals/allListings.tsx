"use client";

import { useState, useEffect, useMemo } from "react";
import { useFavorites } from "@/lib/favorites-context";
import ListingCard from "@/components/listing-card";
import ListingDetailsModal from "@/components/modal/listing-details-modal";
import EditListingModal from "@/components/modal/edit-listing-modal";
import ConfirmationModal from "@/components/modal/confirmation-modal";
import { getRentals } from "@/lib/getRentals-api";
import { editProperty } from "@/lib/edit-property";
import { deleteProperty } from "@/lib/delete-property";

import { useSearchParams, useRouter } from "next/navigation";

interface AppliedFilters {
  category?: string;
  price: { min: number; max: number } | null;
  beds: string;
  baths: string;
  propertyType: string;
}

interface ListingsPanelProps {
  searchLocation?: string;
  filters?: AppliedFilters;
  onLocationClick?: (
    coords: { lng: number; lat: number },
    address: string
  ) => void;
}

interface Listing {
  id: string;
  images: string[];
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  room_type?:
    | "room_self_contain"
    | "2_bedrooms"
    | "room_parlor"
    | "3_plus_bedrooms";
  style: string;
  offers: string | null;
  prices?: { beds: number; price: number }[];
  location: string;
  type: string;
  description?: string;
  amenities?: string[];
  coords?: { lng: number; lat: number };
}

export default function AdminRentals({
  searchLocation = "",
  filters,
  onLocationClick,
}: ListingsPanelProps) {
  const { toggleFavorite, isFavorited } = useFavorites();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Admin states
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  const [sortBy, setSortBy] = useState<
    "recommended" | "price-low" | "price-high" | "newest"
  >("recommended");

  // Pagination Config
  const page = Number(searchParams.get("page")) || 1;
  const PAGE_SIZE = 10;

  const normalizeListing = (listing: any): Listing => {
    const coords =
      listing.coords ||
      (listing.latitude && listing.longitude
        ? { lng: Number(listing.longitude), lat: Number(listing.latitude) }
        : undefined);
    let images = Array.isArray(listing.images)
      ? listing.images
      : typeof listing.images === "string"
      ? [listing.images]
      : [];
    const amenities =
      listing.amenities?.map((a: any) =>
        typeof a === "string" ? a : a.name
      ) || [];

    return {
      ...listing,
      coords,
      images,
      price: Number(listing.price) || 0,
      amenities,
    };
  };

  // Fetch ALL data once (or when filters change)
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiFilters: Record<string, any> = {};
        if (filters?.category) apiFilters.category = filters.category;
        if (filters?.propertyType && filters.propertyType !== "All types")
          apiFilters.propertyType = filters.propertyType;
        if (filters?.price)
          apiFilters.price = { min: filters.price.min, max: filters.price.max };
        if (filters?.beds && filters.beds !== "Any")
          apiFilters.beds = Number(filters.beds.replace("+", ""));
        if (filters?.baths && filters.baths !== "Any")
          apiFilters.baths = Number(filters.baths.replace("+", ""));
        if (searchLocation) apiFilters.searchLocation = searchLocation;

        const response = await getRentals(apiFilters);
        if (!mounted) return;

        const dataArray = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        setAllListings(dataArray.map(normalizeListing));
      } catch (e) {
        console.error("Failed to fetch rentals:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [filters, searchLocation]);

  // 1. Sort the full list
  const sortedListings = useMemo(() => {
    const results = [...allListings];
    if (sortBy === "price-low") results.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") results.sort((a, b) => b.price - a.price);
    if (sortBy === "newest")
      results.sort((a, b) => Number(b.id) - Number(a.id));
    return results;
  }, [allListings, sortBy]);

  // 2. Slice the list for the current page (Client-Side Pagination)
  const paginatedListings = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return sortedListings.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedListings, page]);

  const totalPages = Math.ceil(sortedListings.length / PAGE_SIZE);

  return (
    <div className="bg-white w-full h-full flex flex-col">
      <div className="sticky top-0 bg-white border-b p-4 sm:p-6 z-20 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-4xl font-bold">Admin Rentals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sortedListings.length} total listings | Page {page} of{" "}
            {totalPages || 1}
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="mt-4 sm:mt-0 w-full sm:w-48 px-3 py-2 border rounded-md text-sm font-semibold"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="flex-1 divide-y overflow-y-auto">
        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Loading...</p>
        ) : paginatedListings.length > 0 ? (
          paginatedListings.map((listing) => (
            <div
              key={listing.id}
              className="p-4 border-b flex flex-col sm:flex-row sm:items-center gap-4 group"
            >
              {/* The Card - takes up remaining space */}
              <div className="flex-1">
                <ListingCard
                  listing={listing}
                  isFavorited={isFavorited(listing.id)}
                  onFavoriteToggle={() => toggleFavorite(listing.id)}
                  onViewDetails={() => {
                    setSelectedListing(listing);
                    setIsDetailsOpen(true);
                  }}
                />
              </div>

              {/* Action Buttons - fixed width beside the card */}
              <div className="flex sm:flex-col gap-2 shrink-0 min-w-[100px]">
                <button
                  onClick={() => setEditingListing(listing)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingListing(listing)}
                  className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-muted-foreground">
            No listings found.
          </p>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center items-center gap-4 p-4 border-t bg-gray-50">
        <button
          disabled={page <= 1}
          onClick={() => router.push(`?page=${page - 1}`)}
          className="px-4 py-2 text-sm border rounded bg-white disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => router.push(`?page=${page + 1}`)}
          className="px-4 py-2 text-sm border rounded bg-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals remain the same as your previous working versions */}
      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={isFavorited(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          isOpen={!!editingListing}
          onClose={() => setEditingListing(null)}
          onSave={async (updated) => {
            // 1️⃣ Validate that the updated object has an ID
            if (!updated.id) {
              console.error("Cannot save property without an ID");
              return;
            }

            // 2️⃣ Call the editProperty API
            const updatedProperty = await editProperty(updated.id, updated);

            // 3️⃣ Handle the response
            if (updatedProperty) {
              // Update the local state with the updated property
              setAllListings((prev) =>
                prev.map((item) =>
                  item.id === updatedProperty.id
                    ? normalizeListing(updatedProperty)
                    : item
                )
              );
              setEditingListing(null); // Close the modal
              console.log("Property updated successfully:", updatedProperty);
            } else {
              console.error("Failed to update property");
            }
          }}
        />
      )}

      {deletingListing && (
        <ConfirmationModal
          isOpen={!!deletingListing}
          onCancel={() => setDeletingListing(null)}
          onConfirm={async () => {
            if (!deletingListing?.id) return;

            try {
              const success = await deleteProperty(deletingListing.id);
              if (success) {
                // Remove the listing locally only if API call succeeded
                setAllListings((prev) =>
                  prev.filter((item) => item.id !== deletingListing.id)
                );
                console.log("Property deleted successfully");
              } else {
                console.error("Failed to delete property");
              }
            } catch (err) {
              console.error("Error deleting property:", err);
            } finally {
              setDeletingListing(null); 
            }
          }}
          title="Confirm Deletion"
          message="Are you sure you want to delete this property? This action cannot be undone."
        />
      )}
    </div>
  );
}
