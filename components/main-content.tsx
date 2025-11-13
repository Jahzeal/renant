"use client";

import Map from "./map";
import ListingsPanel from "./listings-panel";

interface MainContentProps {
  location: { lng: number; lat: number } | null;
  locationName: string;
}

export default function MainContent({ location, locationName }: MainContentProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Map Section */}
      <div className="w-full lg:w-1/2 h-64 sm:h-96 md:h-[50vh] lg:h-full bg-gray-200 relative z-0">
        <Map center={location} locationName={locationName} zoom={12} />
      </div>

      {/* Listings Section */}
      <div className="w-full lg:w-1/2 h-[calc(100vh-64px)] lg:h-full overflow-y-auto bg-white shadow-inner">
        <ListingsPanel searchLocation={locationName} />
      </div>
    </div>
  );
}
