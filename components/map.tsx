"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapProps {
  center?: { lng: number; lat: number } | null;
  zoom?: number;
  locationName?: string; // optional: show popup label
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map({ center, zoom = 12, locationName }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // ✅ Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // Start neutral
      zoom: 2,
    });

    // Optional: Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // ✅ Update map when center changes (after search)
  useEffect(() => {
    if (!mapInstance.current || !center) return;

    // Smooth transition to new location
    mapInstance.current.flyTo({ center: [center.lng, center.lat], zoom, essential: true });

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setLngLat([center.lng, center.lat]);
    } else {
      markerRef.current = new mapboxgl.Marker({ color: "#007aff" })
        .setLngLat([center.lng, center.lat])
        .addTo(mapInstance.current);
    }

    // Optional popup with name
    if (locationName) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(locationName);
      markerRef.current.setPopup(popup);
      popup.addTo(mapInstance.current);
    }
  }, [center, zoom, locationName]);

  return <div ref={mapContainer} className="w-full h-full rounded-none" />;
}
