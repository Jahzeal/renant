"use client"

import type React from "react"
import { FavoritesProvider } from "@/lib/favorites-context"
import { RenterRequestsProvider } from "@/lib/renter-requests-context"

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <RenterRequestsProvider>{children}</RenterRequestsProvider>
    </FavoritesProvider>
  )
}
