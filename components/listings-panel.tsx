"use client";

import { useState, useEffect, useMemo } from "react";
import { useFavorites } from "@/lib/favorites-context";
import ListingCard from "./listing-card";
import ListingDetailsModal from "./modal/listing-details-modal";
import { getRentals } from "@/lib/getRentals-api";
import type { MoreOptionsFilters } from "./modal/more-options-modal";

interface AppliedFilters {
  category?: string;
  price: { min: number; max: number } | null;
  beds: string;
  baths: string;
  propertyType: string;
  moreOptions: MoreOptionsFilters | null;
}

interface ListingsPanelProps {
  searchLocation?: string;
  filters?: AppliedFilters;
  onLocationClick?: (
    coords: { lng: number; lat: number },
    address: string
  ) => void;
  onScrollAction?: (direction: "up" | "down") => void;
}

interface Amenity {
  id: string;
  name: string;
  propertyId: string;
}

interface Listing {
  id: string;
  images: string[];
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  room_type?: any;
  style: string;
  offers: string | null;
  prices?: any[];
  location: string;
  type: string;
  description?: string;
  amenities?: string[];
  coords?: { lng: number; lat: number };
}

export default function ListingsPanel({
  searchLocation = "",
  filters,
  onLocationClick,
  onScrollAction,
}: ListingsPanelProps) {
  const { toggleFavorite, isFavorited } = useFavorites();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price-low" | "price-high" | "newest" | "lot-size"
  >("recommended");
  const [loading, setLoading] = useState(false);
  const [lastY, setLastY] = useState(0);

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
    return {
      ...listing,
      coords,
      images,
      price: listing.price || 0,
      amenities: listing.amenities?.map((a: Amenity) => a.name) || [],
    };
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiFilters: Record<string, any> = { ...filters, searchLocation };
        const response = await getRentals(apiFilters);
        if (!mounted) return;
        const normalizedData = (
          Array.isArray(response.data) ? response.data : []
        ).map(normalizeListing);
        setFilteredListings(normalizedData);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [filters, searchLocation]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollAction) return;
    const currentY = e.currentTarget.scrollTop;

    if (currentY <= 5) {
      onScrollAction("up");
      setLastY(currentY);
      return;
    }

    if (Math.abs(currentY - lastY) < 10) return;

    if (currentY > lastY) {
      onScrollAction("down");
    } else {
      onScrollAction("up");
    }
    setLastY(currentY);
  };

  const sortedListings = useMemo(() => {
    const results = [...filteredListings];
    if (sortBy === "price-low") results.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") results.sort((a, b) => b.price - a.price);
    if (sortBy === "newest")
      results.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id));
    return results;
  }, [filteredListings, sortBy]);

  return (
    <div
      onScroll={handleScroll}
      style={{ paddingTop: "var(--mobile-header-height)" }}
      className="flex-1 overflow-y-auto lg:pt-0 scroll-smooth"
    >
      {/* Panel Header: Contains the Available Listings Count */}
      <div className="bg-white border-b p-4 sm:p-6 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              {sortedListings.length} Available Listings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchLocation
                ? `Properties in ${searchLocation}`
                : "Showing all rentals"}
            </p>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-48 text-primary font-semibold text-sm px-3 py-2 border border-primary rounded-md bg-white cursor-pointer focus:outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Payment (Low to High)</option>
              <option value="price-high">Payment (High to Low)</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listing Cards Wrapper */}
      <div className="divide-y">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground animate-pulse">
            Loading listings...
          </div>
        ) : sortedListings.length > 0 ? (
          sortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={isFavorited(listing.id)}
              onFavoriteToggle={() => toggleFavorite(listing.id)}
              onViewDetails={() => {
                setSelectedListing(listing);
                setIsDetailsOpen(true);
              }}
              onLocationClick={() =>
                onLocationClick?.(listing.coords!, listing.address)
              }
            />
          ))
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            No listings found matching your criteria.
          </div>
        )}
      </div>

      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          isFavorited={isFavorited(selectedListing.id)}
          onFavoriteToggle={() => toggleFavorite(selectedListing.id)}
        />
      )}
    </div>
  );
}
