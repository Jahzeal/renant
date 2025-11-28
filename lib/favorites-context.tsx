"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (id: string) => void
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  isFavorited: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Failed to load favorites:", error)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites))
      } catch (error) {
        console.error("Failed to save favorites:", error)
      }
    }
  }, [favorites, isHydrated])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const addFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id))
  }

  const isFavorited = (id: string) => {
    return favorites.includes(id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, addFavorite, removeFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
