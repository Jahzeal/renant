"use client";
import ListingCard from "./listing-card";

interface Listing {
  id: string;
  image: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  style: string;
  offer: string | null;
  prices: { beds: number; price: number }[];
  location: string; // Add location field for filtering
}

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    image: "/modern-apartment-living-room-with-wood-flooring.jpg",
    title: "NOVO New Hampstead",
    address: "480 John Carter Rd, Chapel Hill",
    price: 1575,
    bedrooms: 1,
    style: "Wood-style flooring",
    offer: "12 available units",
    location: "Chapel Hill",
    prices: [
      { beds: 1, price: 1575 },
      { beds: 2, price: 1950 },
      { beds: 3, price: 2350 },
    ],
  },
  {
    id: "2",
    image: "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
    title: "RENDER Turner Lake",
    address: "by Crescent Communities, Raleigh",
    price: 1584,
    bedrooms: 1,
    style: "Sleek urban design",
    offer: "Special Offer",
    location: "Raleigh",
    prices: [
      { beds: 1, price: 1584 },
      { beds: 2, price: 1925 },
      { beds: 3, price: 2309 },
    ],
  },
  {
    id: "3",
    image: "/modern-apartment-with-kitchen-and-dining-area.jpg",
    title: "Downtown Modern",
    address: "123 Main St, Durham",
    price: 1650,
    bedrooms: 1,
    style: "Modern amenities",
    offer: "Special Offer",
    location: "Durham",
    prices: [
      { beds: 1, price: 1650 },
      { beds: 2, price: 2000 },
      { beds: 3, price: 2400 },
    ],
  },
  {
    id: "4",
    image: "/modern-apartment-living-room-with-wood-flooring.jpg",
    title: "Chapel Hill Residences",
    address: "95 University Dr, Chapel Hill",
    price: 1495,
    bedrooms: 1,
    style: "Student-friendly",
    offer: null,
    location: "Chapel Hill",
    prices: [
      { beds: 1, price: 1495 },
      { beds: 2, price: 1795 },
      { beds: 3, price: 2195 },
    ],
  },
  {
    id: "5",
    image: "/luxury-modern-living-room-with-fireplace-and-woode.jpg",
    title: "Raleigh Downtown Lofts",
    address: "234 Fayetteville St, Raleigh",
    price: 1725,
    bedrooms: 1,
    style: "Industrial chic",
    offer: "Special Offer",
    location: "Raleigh",
    prices: [
      { beds: 1, price: 1725 },
      { beds: 2, price: 2150 },
      { beds: 3, price: 2600 },
    ],
  },
];

interface ListingsPanelProps {
  searchLocation?: string;
}

export default function ListingsPanel({
  searchLocation = "",
}: ListingsPanelProps) {
  const filteredListings = searchLocation
    ? SAMPLE_LISTINGS.filter(
        (listing) =>
          listing.location
            .toLowerCase()
            .includes(searchLocation.toLowerCase()) ||
          listing.address.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : SAMPLE_LISTINGS;

  const listingCount = filteredListings.length;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-border p-4 sm:p-6 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Rental Listings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {searchLocation
                ? `${listingCount} rental${
                    listingCount !== 1 ? "s" : ""
                  } found in ${searchLocation}`
                : `${listingCount} rentals available`}
            </p>
          </div>
          <button className="text-primary font-semibold text-sm hover:underline whitespace-nowrap">
            Sort: Recommended ▼
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="divide-y divide-border">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="p-4 sm:p-6 text-center text-muted-foreground">
            <p className="text-sm">No listings found for "{searchLocation}"</p>
            <p className="text-xs mt-2">Try searching for another location</p>
          </div>
        )}
      </div>
    </div>
  );
}
