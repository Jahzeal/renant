"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchUserFavorites, saveUserFavorites, deleteFavorite } from "@/lib/favourite-api";
import { toast } from "@/components/ui/use-toast";

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
      // Optimistic removal: Remove immediately
      const previousFavorites = [...favorites];
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Removed from favorites" });

      try {
        await deleteFavorite(id);
      } catch (e) {
        console.error("Delete favorite failed", e);
        // Revert on failure
        setFavorites(previousFavorites);
        toast({ title: "Failed to remove favorite", variant: "destructive" });
      }
    } else {
      // Optimistic addition: Add a temporary placeholder immediately
      const tempProperty: Property = { id, title: "", price: 0, images: [] };
      const previousFavorites = [...favorites];
      setFavorites((prev) => [...prev, tempProperty]);
      toast({ title: "Added to favorites" });

      try {
        const propertyObj = await saveUserFavorites(id);

        const cleaned = sanitize(propertyObj);
        if (cleaned) {
           // If backend returned valid data, update the placeholder
           setFavorites((prev) => prev.map((f) => (f.id === id ? cleaned : f)));
        }
        // If !cleaned, we KEEP the placeholder (assume success), effectively trusting the optimistic update.
        // We only revert in the catch block (network/server error).
      } catch (e) {
        console.error("Save favorite failed", e);
        // Revert on failure
        setFavorites(previousFavorites);
        toast({ title: "Failed to add favorite", variant: "destructive" });
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
