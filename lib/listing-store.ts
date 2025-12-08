
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Listing {
  id: string;
  hostelName: string;
  price: string;
  amount: number;
  address: string;
  name: string; 
  isActive: boolean;
}

interface ListingsStore {
  listings: Listing[];
  addListing: (listing: Omit<Listing, "id" | "isActive">) => void;
  removeListing: (id: string) => void;
  toggleActive: (id: string) => void;
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
        },
        {
          id: "demo-2",
          hostelName: "Peace Lodge",
          price: "₦3,900",
          amount: 3900,
          address: "Akoka, Yaba",
          name: "Chioma",
          isActive: true,
        },
      ],

      addListing: (newListing) =>
        set((state) => ({
          listings: [
            {
              ...newListing,
              id: Date.now().toString(),
              isActive: true,
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
    }),
    {
      name: "hostel-listings-storage", 
    }
  )
);