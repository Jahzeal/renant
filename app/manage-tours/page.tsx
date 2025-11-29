"use client"

import Link from "next/link"
import { useRenterRequests } from "@/lib/renter-requests-context"
import { Calendar, DollarSign, Trash2 } from "lucide-react"
import PageHeader from "@/components/page-header"

export default function ManageToursPage() {
  const { tourRequests, removeTourRequest } = useRenterRequests()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
        <PageHeader/>
      <div className="border-b">
        <div className="w-full px-2 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
            <nav className="flex gap-3 sm:gap-6 overflow-x-auto text-xs sm:text-sm flex-1">
              <Link
                href="/saved-homes"
                className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Saved homes
              </Link>
              <Link
                href="/manage-tours"
                className="pb-2 sm:pb-4 border-b-2 border-primary text-primary font-medium whitespace-nowrap"
              >
                Manage tours
              </Link>
              <Link
                href="/renter-hub"
                className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Rentals Hub
              </Link>
              <Link
                href="/account-settings"
                className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Account settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Manage Tours</h1>

        {tourRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
            <div className="text-center space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">No tour requests yet</h2>
              <p className="text-muted-foreground">
                When you request tours for homes, they'll appear here so you can manage them.
              </p>
              <Link
                href="/rentals"
                className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
              >
                Browse Homes
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tourRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{request.listingTitle}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      {request.listingPrice && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {request.listingPrice}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Requested by:</span> {request.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {request.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {request.phone}
                      </p>
                      {request.message && (
                        <p>
                          <span className="font-medium">Message:</span> {request.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <button
                      onClick={() => removeTourRequest(request.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete tour request"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
