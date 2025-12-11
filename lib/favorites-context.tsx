"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchUserFavorites, saveUserFavorites, deleteFavorite } from "@/lib/favourite-api";

interface Property {
  id: string;
  title?: string;
  price?: number;
  images?: string[];
}

interface FavoritesContextType {
  favorites: Property[];
  toggleFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loaded, setLoaded] = useState(false);

  // SAFELY Validate what we push in state
  const sanitize = (item: any): Property | null => {
    if (!item) return null;
    if (!item.id) return null; // MUST have ID

    return {
      id: item.id,
      title: item.title ?? "",
      price: item.price ?? 0,
      images: item.images ?? [],
    };
  };

  // Load initial favorites from backend
  useEffect(() => {
    async function load() {
      try {
        const remote = await fetchUserFavorites();

        // clean the array so there is no undefined
        const cleaned = remote
          .map((item: any) => sanitize(item))
          .filter((x: any) => x !== null) as Property[];

        setFavorites(cleaned);
      } catch (e) {
        console.error("Could not load favorites", e);
      }
      setLoaded(true);
    }

    load();
  }, []);

  const toggleFavorite = async (id: string) => {
    const exists = favorites.some((f) => f.id === id);

    if (exists) {
      // remove locally
      setFavorites((prev) => prev.filter((f) => f.id !== id));

      try {
        await deleteFavorite(id);
      } catch (e) {
        console.error("Delete favorite failed", e);
      }
    } else {
      try {
        const propertyObj = await saveUserFavorites(id);

        const cleaned = sanitize(propertyObj);
        if (!cleaned) return;

        setFavorites((prev) => [...prev, cleaned]);
      } catch (e) {
        console.error("Save favorite failed", e);
      }
    }
  };

  const isFavorited = (id: string) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
