"use client";

import { useEffect, useState } from "react";
import Map from "./map";
import ListingsPanel from "./listings-panel";

interface MainContentProps {
  location: { lng: number; lat: number } | null;
  locationName: string;
  filters?: any;
  onScrollAction: (direction: "up" | "down") => void; 
}

export default function MainContent({
  location,
  locationName,
  filters,
  onScrollAction, 
}: MainContentProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(location);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);

  const handleLocationClick = (
    coords: { lng: number; lat: number },
    address: string
  ) => {
    setSelectedLocation(coords);
    setSelectedAddress(address);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-gray-50 overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 h-full bg-gray-200 relative z-0 isolate">
        <Map
          coords={selectedLocation || location}
          locationName={selectedAddress || locationName}
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white shadow-inner overflow-hidden">
        <ListingsPanel
          searchLocation={locationName}
          filters={filters}
          onLocationClick={handleLocationClick}
          onScrollAction={onScrollAction}
        />
      </div>
    </div>
  );
}