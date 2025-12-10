"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useListingsStore } from "@/lib/listing-store" // Assuming this store is correct
import PostHostelModal from "@/components/modal/post-hostel-modal" // Assuming this component is correct
import HostelSellCard from "./HostelSellCard" // Assuming this component is correct

// Define the shape of the data submitted from the modal
interface HostelSubmissionData {
  hostelName: string
  price: string
  address: string
  images: File[]
}

export default function Seller() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  // Destructure store actions and state
  const { listings, addListing, removeListing } = useListingsStore()

  // Use a hardcoded user name for demonstration/filtering
  const currentUserName = "You" 
  const myListings = listings.filter((l) => l.name === currentUserName && l.isActive)

  /**
   * Handles the submission of a new hostel listing from the modal.
   * Converts image files to base64 strings before adding to the store.
   */
  const handlePostHostelSubmit = async (data: HostelSubmissionData) => {
    // Convert images to base64 strings asynchronously
    const imagePromises = data.images.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })

    const imageStrings = await Promise.all(imagePromises)

    // Add the new listing to the global store
    addListing({
      hostelName: data.hostelName,
      // Format the price for display (e.g., ₦1,000,000)
      price: `₦${Number(data.price).toLocaleString()}`, 
      amount: Number(data.price), // Store the numeric value for sorting/logic if needed
      address: data.address,
      name: currentUserName,
      images: imageStrings,
      // The store should automatically add id, isActive=true, and potentially a timestamp
    })

    setIsPostModalOpen(false) // Close the modal on successful submission
  }

  // Check if the current route is the seller route
  const isSellActive = pathname.includes("/seller")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                aria-label="Go back"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Enscroll
                </h1>
                <p className="text-xs text-muted-foreground">Sell Properties</p>
              </div>
            </div>

            {/* Navigation Toggle and How It Works Link */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Buy/Sell Toggle */}
              <div className="relative inline-flex bg-muted rounded-full p-1 shadow-sm border border-border">
                {/* Active Indicator Slider */}
                <div
                  className={`absolute inset-y-1 left-1 w-[calc(50%-2px)] bg-primary rounded-full transition-all duration-300 ease-out shadow-md ${
                    !isSellActive ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                {/* Buy Button */}
                <button
                  onClick={() => router.push("/buyer")}
                  className={`relative z-10 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                    !isSellActive ? "text-white" : "text-foreground"
                  }`}
                >
                  Buy
                </button>
                {/* Sell Button */}
                <button
                  onClick={() => router.push("/seller")}
                  className={`relative z-10 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                    isSellActive ? "text-white" : "text-foreground"
                  }`}
                >
                  Sell
                </button>
              </div>
              {/* How It Works Link */}
              <Link
                href="/how-it-works"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-accent transition-colors hover:bg-primary/5 rounded-lg"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Listings Summary and Desktop Post Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Listings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {myListings.length} active {myListings.length === 1 ? "listing" : "listings"}
              </p>
            </div>

            {/* Desktop Post Button */}
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="hidden sm:flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Post New Property
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {myListings.length > 0 ? (
          /* Listings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myListings.map((listing) => (
              <HostelSellCard
                key={listing.id}
                hostelName={listing.hostelName}
                price={listing.price}
                address={listing.address}
                isActive={listing.isActive}
                images={listing.images || []}
                onEdit={() => alert("Edit feature coming soon!")}
                onDelete={() => {
                  if (confirm("Delete this listing permanently?")) {
                    removeListing(listing.id)
                  }
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl border-2 border-dashed border-border">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No listings yet</h3>
              <p className="text-muted-foreground mb-8">
                Start earning by posting your first property today!
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Post Your First Property
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 sm:hidden w-16 h-16 bg-gradient-to-br from-primary to-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
        aria-label="Post new property"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Post Hostel Modal */}
      <PostHostelModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostHostelSubmit}
      />
    </div>
  )
}