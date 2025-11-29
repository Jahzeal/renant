"use client"

import type React from "react"
import { FavoritesProvider } from "@/lib/favorites-context"
import { RenterRequestsProvider } from "@/lib/renter-requests-context"
import { SearchHistoryProvider } from "@/lib/search-history-contsxt"

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
   <SearchHistoryProvider>
      <FavoritesProvider>
        <RenterRequestsProvider>{children}</RenterRequestsProvider>
      </FavoritesProvider>
    </SearchHistoryProvider>
  )
}
