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

const parseUrlParams = (
  params: URLSearchParams
): {
  name: string;
  coords: { lng: number; lat: number } | null;
  filters: AppliedFilters;
} => {
  // Support both "location" (legacy/map) and "keywords" (text search) params for the name
  const name = params.get("keywords") || params.get("location") || "";
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
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Initialize URL params
  useEffect(() => {
    const initialData = parseUrlParams(searchParams);
    setLocation(initialData.coords);
    setLocationName(initialData.name);
    setFilters(initialData.filters);
    setIsInitialized(true);
  }, [searchParams]);

  // Scroll handler for showing/hiding header on mobile
  useEffect(() => {
    const handleScroll = () => {
      // Only apply on mobile where window scrolls
      if (window.innerWidth >= 1024) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Scrolling up
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = useCallback(
    (name: string, coords?: { lng: number; lat: number }) => {
      setLocationName(name || "");
      setLocation(coords || null);

      const params = new URLSearchParams();

      if (name) {
        if (coords) {
          // If coordinates exist, it's likely a specific location/address search
          params.set("location", name);
          params.set("lat", coords.lat.toString());
          params.set("lng", coords.lng.toString());
        } else {
          // If no coordinates, it's a keyword/text search -> use 'keywords' param
          params.set("keywords", name);
        }
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

      if (locationName) {
        if (location) {
          params.set("location", locationName);
          params.set("lat", location.lat.toString());
          params.set("lng", location.lng.toString());
        } else {
           // Persist as keywords if no location data matches
           params.set("keywords", locationName);
        }
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
    <main className="min-h-screen bg-background flex flex-col">
      <div className={`sticky lg:relative top-0 z-40 transition-transform duration-300 lg:translate-y-0 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <Header />
        {/* Search Bar and Filters */}
        <SearchBar
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
          filters={filters}
        />
      </div>

      {/* Map + Listings - Sticky on Desktop, Normal flow on Mobile */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <MainContent
          location={location}
          locationName={locationName}
          filters={filters}
        />
      </div>
    </main>
  );
}
