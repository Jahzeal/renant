"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchUserFavorites, saveUserFavorites, deleteFavorite } from "@/lib/favourite-api"


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
  const [isLoadedFromBackend, setIsLoadedFromBackend] = useState(false)

  //load from backend 

  useEffect(() => {
    async function load() {
    try {
      const remoteFavs = await fetchUserFavorites()
      setFavorites(remoteFavs)
    
    } catch (error) {
      console.error("Could not fetch user favourite", error)
  }
  setIsLoadedFromBackend(true)
}
load()
}, [])


  useEffect(() => {
    if (!isLoadedFromBackend) return // Wait until loaded from backend
    async function syncToBackend() {
      try {
        await saveUserFavorites(favorites)
      } catch (error){
      console.error('Could not save Favourite', error)
    }
  }
    syncToBackend()
  }, [favorites, setIsLoadedFromBackend])

  // local actions

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
