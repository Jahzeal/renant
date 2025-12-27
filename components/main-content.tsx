"use client"

import { useEffect, useState } from "react"
import Map from "./map"
import ListingsPanel from "./listings-panel"

interface MainContentProps {
  location: { lng: number; lat: number } | null
  locationName: string
  filters?: any
}

export default function MainContent({ location, locationName, filters }: MainContentProps) {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lng: number; lat: number } | null>(location)
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [appliedFilters, setAppliedFilters] = useState(filters)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const handleChange = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches)

    setIsLargeScreen(mql.matches)
    mql.addEventListener("change", handleChange)

    return () => mql.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    setSelectedLocation(location)
  }, [location])

  useEffect(() => {
    setAppliedFilters(filters)
  }, [filters])

  const handleLocationClick = (coords: { lng: number; lat: number }, address: string) => {
    console.log("MainContent handleLocationClick called with:", { coords, address })
    setSelectedLocation(coords)
    setSelectedAddress(address)
  }

  const handleFiltersChange = (newFilters: any) => {
    setAppliedFilters(newFilters)
  }

  return (
    <div className="flex flex-col lg:flex-row w-full lg:h-full bg-gray-50 lg:overflow-hidden">
      <div className="hidden lg:block lg:w-1/2 h-64 sm:h-96 md:h-[500px] lg:h-full bg-gray-200 relative z-0 isolate">
        <Map
          coords={selectedLocation || location}
          locationName={selectedAddress || locationName}
        />
      </div>

      <div className="w-full lg:w-1/2 lg:h-full flex flex-col bg-white shadow-inner lg:overflow-hidden">
        <ListingsPanel
          searchLocation={locationName}
          filters={appliedFilters}
          onLocationClick={handleLocationClick}
        />
      </div>
    </div>
  )
}
