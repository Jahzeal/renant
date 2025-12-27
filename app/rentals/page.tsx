"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";

interface AppliedFilters {
  price: { min: number; max: number } | null;
  beds: string;
  baths: string;
  propertyType: string;
  moreOptions: any;
}

/**
 * Map UI values → Prisma enum values
 * Prevents 500 errors
 */
const PROPERTY_TYPE_MAP: Record<string, string | undefined> = {
  apartment: "APARTMENT",
  shortlet: "ShortLET",
  hostel: "Hostels",
};

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

  const [showHeader, setShowHeader] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync URL → state
  useEffect(() => {
    const initial = parseUrlParams(searchParams);
    setLocation(initial.coords);
    setLocationName(initial.name);
    setFilters(initial.filters);
  }, [searchParams]);

  // Mobile scroll behavior
  const handleScrollAction = useCallback((direction: "up" | "down") => {
    if (window.innerWidth < 1024) {
      setShowHeader(direction === "up");
    }
  }, []);

  // Location search
  const handleSearch = useCallback(
    (name: string, coords?: { lng: number; lat: number }) => {
      setLocationName(name || "");
      setLocation(coords || null);

      const params = new URLSearchParams(searchParams.toString());

      if (name) params.set("location", name);
      if (coords) {
        params.set("lat", coords.lat.toString());
        params.set("lng", coords.lng.toString());
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Filters change
  const handleFiltersChange = useCallback(
    (newFilters: AppliedFilters) => {
      setFilters(newFilters);

      const params = new URLSearchParams(searchParams.toString());

      if (locationName) params.set("location", locationName);

      if (newFilters.price) {
        params.set("priceMin", newFilters.price.min.toString());
        params.set("priceMax", newFilters.price.max.toString());
      } else {
        params.delete("priceMin");
        params.delete("priceMax");
      }

      newFilters.beds !== "Any"
        ? params.set("beds", newFilters.beds)
        : params.delete("beds");

      newFilters.baths !== "Any"
        ? params.set("baths", newFilters.baths)
        : params.delete("baths");

      if (newFilters.propertyType !== "All types") {
        params.set("propertyType", newFilters.propertyType);
      } else {
        params.delete("propertyType");
      }

      router.push(`?${params.toString()}`);
    },
    [locationName, router, searchParams]
  );

  return (
    <main className="h-screen bg-white flex flex-col overflow-hidden relative">
      {/* MOBILE HEADER */}
      <div
        ref={headerRef}
        className={`
          flex flex-col bg-white z-[100] border-b transition-all duration-300 ease-in-out
          ${
            showHeader
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
          filters={filters}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <MainContent
          location={location}
          locationName={locationName}
          filters={{
            ...filters,
            propertyType:
              PROPERTY_TYPE_MAP[filters.propertyType.toLowerCase()] ??
              undefined,
          }}
          onScrollAction={handleScrollAction}
        />
      </div>
    </main>
  );
}
