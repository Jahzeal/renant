"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapProps {
  center?: { lng: number; lat: number } | null
  locationName?: string
  height?: string
  zoom?: number
}

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  console.warn("[v0] Mapbox token not configured in NEXT_PUBLIC_MAPBOX_TOKEN")
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export default function Map({ center, locationName, height = "500px", zoom = 12 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) {
      console.log("[v0] Map container not yet available")
      return
    }

    if (mapInstance.current) {
      console.log(" Map already initialized")
      return
    }

    try {
      console.log("Initializing Mapbox map")
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0],
        zoom: 2,
      })

      mapInstance.current.addControl(new mapboxgl.NavigationControl())

      const handleResize = () => {
        if (mapInstance.current) {
          mapInstance.current.resize()
        }
      }

      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(mapContainer.current)

      return () => {
        resizeObserver.disconnect()
        if (mapInstance.current) {
          mapInstance.current.remove()
          mapInstance.current = null
        }
      }
    } catch (error) {
      console.error(" Error initializing map:", error)
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !center) {
      console.log(" Map or center not available", { hasMap: !!mapInstance.current, hasCenter: !!center })
      return
    }

    try {
      console.log(" Updating map center and marker", center)

      // Fly to the new location
      mapInstance.current.flyTo({
        center: [center.lng, center.lat],
        zoom,
        essential: true,
      })

      if (markerRef.current) {
        markerRef.current.setLngLat([center.lng, center.lat])

        if (locationName) {
          const popup = markerRef.current.getPopup()
          if (!popup) {
            markerRef.current.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(locationName))
          } else {
            popup.setText(locationName)
          }
        } else {
          markerRef.current.setPopup(null)
        }
      } else {
        markerRef.current = new mapboxgl.Marker({ color: "#007aff" }).setLngLat([center.lng, center.lat])

        if (locationName) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(locationName)
          markerRef.current.setPopup(popup)
        }

        if (mapInstance.current.isStyleLoaded()) {
          markerRef.current.addTo(mapInstance.current)
        } else {
          mapInstance.current.once("style.load", () => {
            if (markerRef.current && mapInstance.current) {
              markerRef.current.addTo(mapInstance.current)
            }
          })
        }
      }
    } catch (error) {
      console.error(" Error updating marker:", error)
    }
  }, [center, locationName, zoom])

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full bg-gray-100" style={{ minHeight: height }} />
      {!mapInstance.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}
    </div>
  )
}