"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";

interface AppliedFilters {
  category?: string;
  price: { min: number; max: number } | null;
  beds: string;
  baths: string;
  propertyType: string;
  moreOptions: any;
}

const parseUrlParams = (
  params: URLSearchParams
): {
  name: string;
  coords: { lng: number; lat: number } | null;
  filters: AppliedFilters;
} => {
  const name = params.get("location") || "";
  const lat = params.get("lat");
  const lng = params.get("lng");
  const priceMin = params.get("priceMin");
  const priceMax = params.get("priceMax");
  const beds = params.get("beds") || "Any";
  const baths = params.get("baths") || "Any";
  const propertyType = params.get("propertyType") || "All types";

  const coords =
    lat && lng
      ? { lng: Number.parseFloat(lng), lat: Number.parseFloat(lat) }
      : null;

  const price =
    priceMin && priceMax
      ? { min: Number.parseFloat(priceMin), max: Number.parseFloat(priceMax) }
      : null;

  const filters: AppliedFilters = {
    price,
    beds,
    baths,
    propertyType,
    moreOptions: null,
  };

  return { name, coords, filters };
};

export default function Rentals() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState<{ lng: number; lat: number } | null>(
    null
  );
  const [locationName, setLocationName] = useState("");
  const [filters, setFilters] = useState<AppliedFilters>({
    price: null,
    beds: "Any",
    baths: "Any",
    propertyType: "All types",
    moreOptions: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize URL params
  useEffect(() => {
    const initialData = parseUrlParams(searchParams);
    setLocation(initialData.coords);
    setLocationName(initialData.name);
    setFilters(initialData.filters);
    setIsInitialized(true);
  }, [searchParams]);

  const handleSearch = useCallback(
    (name: string, coords?: { lng: number; lat: number }) => {
      setLocationName(name || "");
      setLocation(coords || null);

      const params = new URLSearchParams();
      if (name) params.set("location", name);
      if (coords) {
        params.set("lat", coords.lat.toString());
        params.set("lng", coords.lng.toString());
      }

      // Preserve filters
      if (filters.price) {
        params.set("priceMin", filters.price.min.toString());
        params.set("priceMax", filters.price.max.toString());
      }
      if (filters.beds !== "Any") params.set("beds", filters.beds);
      if (filters.baths !== "Any") params.set("baths", filters.baths);
      if (filters.propertyType !== "All types")
        params.set("propertyType", filters.propertyType);

      router.push(`?${params.toString()}`);
    },
    [filters, router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: AppliedFilters) => {
      setFilters(newFilters);

      const params = new URLSearchParams();
      if (locationName) params.set("location", locationName);
      if (location) {
        params.set("lat", location.lat.toString());
        params.set("lng", location.lng.toString());
      }
      if (newFilters.price) {
        params.set("priceMin", newFilters.price.min.toString());
        params.set("priceMax", newFilters.price.max.toString());
      }
      if (newFilters.beds !== "Any") params.set("beds", newFilters.beds);
      if (newFilters.baths !== "Any") params.set("baths", newFilters.baths);
      if (newFilters.propertyType !== "All types")
        params.set("propertyType", newFilters.propertyType);

      router.push(`?${params.toString()}`);
    },
    [locationName, location, router]
  );

  // Log state when ready
  useEffect(() => {
    if (isInitialized) {
      console.log("Current Location/Filters state:", {
        locationName,
        location,
        filters,
      });
    }
  }, [locationName, location, filters, isInitialized]);

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />

      {/* Search Bar and Filters */}
      <SearchBar
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />

      {/* Map + Listings */}
      <div className="h-full overflow-hidden">
        <MainContent
          location={location}
          locationName={locationName}
          filters={filters}
        />
      </div>
    </main>
  );
}