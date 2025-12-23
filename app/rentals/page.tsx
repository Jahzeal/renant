"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const parseUrlParams = (params: URLSearchParams) => {
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

  // State
  const [location, setLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [locationName, setLocationName] = useState("");
  const [filters, setFilters] = useState<AppliedFilters>({
    price: null,
    beds: "Any",
    baths: "Any",
    propertyType: "All types",
    moreOptions: null,
  });

  const [showHeader, setShowHeader] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync state with URL on load
  useEffect(() => {
    const initialData = parseUrlParams(searchParams);
    setLocation(initialData.coords);
    setLocationName(initialData.name);
    setFilters(initialData.filters);
  }, [searchParams]);

  // Handle mobile scroll behavior
  // This logic ensures that when the header hides, it doesn't leave a "hole"
  const handleScrollAction = useCallback((direction: "up" | "down") => {
    if (window.innerWidth < 1024) {
      if (direction === "down") {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    }
  }, []);

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
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: AppliedFilters) => {
      setFilters(newFilters);
      const params = new URLSearchParams(searchParams.toString());
      if (locationName) params.set("location", locationName);
      if (newFilters.beds !== "Any") {
        params.set("beds", newFilters.beds);
      } else {
        params.delete("beds");
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
    [locationName, router, searchParams]
  );

  return (
    <main className="h-screen bg-white flex flex-col overflow-hidden relative">
      {/* MOBILE HEADER WRAPPER 
          - On mobile: It is part of the flex flow when visible.
          - It uses 'margin-top' animation to smoothly slide out of view.
      */}
      <div
        ref={headerRef}
        className={`
          flex flex-col bg-white z-[100] border-b transition-all duration-300 ease-in-out
          ${showHeader 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none absolute w-full"
          }
          lg:relative lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto
        `}
      >
        <Header />
        <SearchBar
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* MAIN CONTENT AREA
          - 'flex-1' allows this div to fill the remaining screen height.
          - 'overflow-hidden' ensures only the internal list scrolls.
      */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <MainContent
          location={location}
          locationName={locationName}
          filters={filters}
          onScrollAction={handleScrollAction}
        />
      </div>
    </main>
  );
}