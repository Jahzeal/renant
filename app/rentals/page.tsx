"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";

interface AppliedFilters {
  price: { min: number; max: number } | null;
  beds: string;
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
  const propertyType = params.get("propertyType") || "All types";

  const coords =
    lat && lng
      ? { lng: Number.parseFloat(lng), lat: Number.parseFloat(lat) }
      : null;
  const price =
    priceMin && priceMax
      ? { min: Number.parseFloat(priceMin), max: Number.parseFloat(priceMax) }
      : null;

  return {
    name,
    coords,
    filters: { price, beds, propertyType, moreOptions: null },
  };
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
    propertyType: "All types",
    moreOptions: null,
  });

  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const initialData = parseUrlParams(searchParams);
    setLocation(initialData.coords);
    setLocationName(initialData.name);
    setFilters(initialData.filters);
  }, [searchParams]);

  const handleScrollAction = useCallback((direction: "up" | "down") => {
    if (window.innerWidth < 1024) {
      setShowHeader(direction === "up");
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
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: AppliedFilters) => {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (locationName) params.set("location", locationName);
      if (newFilters.beds !== "Any") params.set("beds", newFilters.beds);
      router.push(`?${params.toString()}`);
    },
    [locationName, router]
  );

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden relative">
      <div
        className={`
    fixed top-0 left-0 right-0 z-[100] bg-white
    transition-transform duration-300 ease-in-out border-b
    ${showHeader ? "translate-y-0" : "-translate-y-full"}
    lg:relative lg:translate-y-0
  `}
        id="mobile-header"
      >
        <Header />
        <SearchBar
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <div className="flex-1 overflow-hidden">
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
