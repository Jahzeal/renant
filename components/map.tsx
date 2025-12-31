"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapProps {
  coords?: { lng: number; lat: number } | null
  locationName?: string
  zoom?: number
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export default function Map({
  coords,
  locationName,
  zoom = 12,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    if (!mapboxgl.accessToken) {
      console.error("Mapbox token missing")
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coords ? [coords.lng, coords.lat] : [0, 0],
        zoom: coords ? zoom : 2,
      })

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right")

      map.on("load", () => {
        map.resize()
        setIsLoading(false)
      })

      map.on("error", () => {
        setHasError(true)
        setIsLoading(false)
      })

      mapRef.current = map

      return () => {
        map.remove()
        mapRef.current = null
      }
    } catch (err) {
      console.error("Map init error:", err)
      setHasError(true)
      setIsLoading(false)
    }
  }, [])

  // Update location + marker
  useEffect(() => {
    if (!mapRef.current || !coords) return

    const { lng, lat } = coords
    if (!isFinite(lng) || !isFinite(lat)) return

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom,
      essential: true,
    })

    if (markerRef.current) {
      markerRef.current.remove()
    }

    const marker = new mapboxgl.Marker({ color: "#2563eb" })
      .setLngLat([lng, lat])

    if (locationName) {
      marker.setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="font-size:14px;font-weight:600">${locationName}</div>`
        )
      )
    }

    marker.addTo(mapRef.current)
    markerRef.current = marker
  }, [coords, locationName, zoom])

  return (
    <div className="relative w-full h-full">
      {/* MAP CONTAINER */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {/* LOADING OVERLAY */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Loading map…</p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-sm text-gray-600">Unable to load map</p>
        </div>
      )}
    </div>
  )
}
