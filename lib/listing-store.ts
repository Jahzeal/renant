// lib/listing-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Listing {
  id: string
  hostelName: string
  price: string
  amount: number
  address: string
  name: string
  isActive: boolean
  images: string[] // Array of base64 strings or Cloudinary URLs
}

interface ListingsStore {
  listings: Listing[]
  addListing: (listing: Omit<Listing, "id" | "isActive">) => void
  removeListing: (id: string) => void
  toggleActive: (id: string) => void
  updateListing: (id: string, updates: Partial<Listing>) => void // Optional: for future edit
}

export const useListingsStore = create<ListingsStore>()(
  persist(
    (set) => ({
      listings: [
        {
          id: "demo-1",
          hostelName: "Victory Lodge",
          price: "₦5,500",
          amount: 5500,
          address: "24, Ikorodu Rd, Lagos",
          name: "Dangogo",
          isActive: true,
          images: [
             "https://res.cloudinary.com/prod/image/upload/e_enhance/me/underexposed-1.jpg",
            
          ],
        },
        {
          id: "demo-2",
          hostelName: "Peace Lodge",
          price: "₦3,900",
          amount: 3900,
          address: "Akoka, Yaba, Lagos",
          name: "Chioma",
          isActive: true,
          images: [
       "  https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
            "https://images.unsplash.com/photo-1560448075-a3c32f159586?w=800&q=80",
            "https://images.unsplash.com/photo-1618778183789-9d84a8e9fe60?w=800&q=80",       ],
        },
        {
          id: "demo-3",
          hostelName: "Sunrise Hostel",
          price: "₦7,000",
          amount: 7000,
          address: "Ogba, Ikeja",
          name: "Aisha",
          isActive: true,
          images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
            "https://images.unsplash.com/photo-1560448075-a3c32f159586?w=800&q=80",
            "https://images.unsplash.com/photo-1618778183789-9d84a8e9fe60?w=800&q=80",
          ],
        },
      ],

      addListing: (newListing) =>
        set((state) => ({
          listings: [
            {
              ...newListing,
              id: crypto.randomUUID(), // Better than Date.now()
              isActive: true,
              images: newListing.images || [], // Ensure images are saved
            },
            ...state.listings,
          ],
        })),

      removeListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        })),

      toggleActive: (id) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, isActive: !l.isActive } : l
          ),
        })),

      updateListing: (id, updates) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),
    }),
    {
      name: "enscroll-listings-storage", // Key in localStorage
    }
  )
)