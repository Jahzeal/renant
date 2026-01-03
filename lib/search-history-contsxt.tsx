"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

export interface SearchHistory {
  id: string
  location: string
  query?: string // Added query field to store original search term
  coords?: { lng: number; lat: number }
  timestamp: number
}

interface SearchHistoryContextType {
  searchHistory: SearchHistory[]
  addSearch: (search: SearchHistory) => void
  clearHistory: () => void
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined)

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
    if (user?.email) {
      const userKey = `searchHistory_${user.email}`
      const saved = localStorage.getItem(userKey)
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved))
        } catch (error) {
          console.error(" Error parsing search history:", error)
          setSearchHistory([])
        }
      } else {
        setSearchHistory([])
      }
    } else {
      // If no user is logged in, clear search history
      setSearchHistory([])
    }
  }, [user?.email])

  const addSearch = (search: SearchHistory) => {
    if (!user?.email) return

    const updated = [search, ...searchHistory.slice(0, 4)]
    setSearchHistory(updated)

    const userKey = `searchHistory_${user.email}`
    localStorage.setItem(userKey, JSON.stringify(updated))
  }

  const clearHistory = () => {
    if (!user?.email) return

    setSearchHistory([])
    const userKey = `searchHistory_${user.email}`
    localStorage.removeItem(userKey)
  }

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, addSearch, clearHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  )
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext)
  if (!context) {
    throw new Error("useSearchHistory must be used within SearchHistoryProvider")
  }
  return context
}
