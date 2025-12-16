"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapProps {
  coords?: { lng: number; lat: number } | { longitude: number; latitude: number } | null
  locationName?: string
  height?: string
  zoom?: number
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export default function Map({ coords, locationName, height = "500px", zoom = 12 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    if (!mapboxgl.accessToken) {
      console.error("[v0] Mapbox token is missing. Add NEXT_PUBLIC_MAPBOX_TOKEN to environment variables")
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coords ? [coords.lng, coords.lat] : [0, 0],
        zoom: coords ? zoom : 2,
      })

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

      map.on("load", () => {
        setIsLoading(false)
      })

      map.on("error", (e) => {
        console.error("[v0] Map error:", e)
        setHasError(true)
        setIsLoading(false)
      })

      mapInstance.current = map

      return () => {
        map.remove()
        mapInstance.current = null
      }
    } catch (error) {
      console.error("[v0] Error initializing map:", error)
      setHasError(true)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !coords) return

    // Validate that coordinates are valid numbers and support both formats
    // We cast to any here to safely access potential properties without complex type guards
    const c = coords as any
    const rawLng = c.lng ?? c.longitude
    const rawLat = c.lat ?? c.latitude

    const lng = typeof rawLng === "number" && isFinite(rawLng) ? rawLng : null
    const lat = typeof rawLat === "number" && isFinite(rawLat) ? rawLat : null

    if (lng === null || lat === null) {
      console.warn("[v0] Invalid coordinates received:", coords)
      return
    }

    try {
      mapInstance.current.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      })

      if (markerRef.current) {
        markerRef.current.remove()
      }

      const marker = new mapboxgl.Marker({ color: "#3b82f6" }).setLngLat([lng, lat])

      if (locationName) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`<div class="text-sm font-semibold">${locationName}</div>`),
        )
      }

      marker.addTo(mapInstance.current)
      markerRef.current = marker
    } catch (error) {
      console.error("[v0] Error updating marker:", error)
    }
  }, [coords, locationName, zoom])

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: height }} />

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <p className="text-sm text-gray-600">Unable to load map</p>
            {locationName && <p className="text-xs text-gray-500 mt-1">{locationName}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
