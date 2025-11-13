"use client";

import { useState } from "react";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";

export default function Home() {
  const [location, setLocation] = useState<{ lng: number; lat: number } | null>(
    null
  );
  const [locationName, setLocationName] = useState<string>("");

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Search bar */}
      <SearchBar
        onSearch={(name, coords) => {
          setLocation(coords || null);
          setLocationName(name || "");
        }}
      />

      {/* Main content with Map and Listings */}
      <MainContent location={location} locationName={locationName} />
    </main>
  );
}
