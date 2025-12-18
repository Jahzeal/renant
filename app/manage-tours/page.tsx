"use client"

import Link from "next/link"
import { useRenterRequests } from "@/lib/renter-requests-context"
import { Calendar, XCircle } from "lucide-react"
import PageHeader from "@/components/page-header"

export default function ManageToursPage() {
  const { tourRequests, removeTourRequest } = useRenterRequests()

  const handleCancelTour = async (id: string) => {
    try {
      await removeTourRequest(id)
    } catch (error: any) {
      console.error("Failed to cancel tour:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  const formatPropertyType = (type: string) => {
    switch (type) {
      case "apartment":
        return "Apartment"
      case "hostel":
        return "Hostel"
      case "shortlet":
        return "Shortlet"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Tabs */}
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
                Renter Hub
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

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Tours</h1>

        {tourRequests.length === 0 ? (
          <p className="text-muted-foreground">You have no tour requests.</p>
        ) : (
          <div className="space-y-4">
            {tourRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-lg p-4"
              >
                {/* Info */}
                <div>
                  <h3 className="font-semibold text-lg">{request.propertyTitle}</h3>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    

                    {request.propertyPrice && (
                      <span className="flex items-center gap-1">
                       ₦{request.propertyPrice}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Cancel button */}
                <button
                  onClick={() => handleCancelTour(request.id)}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:underline"
                >
                  <XCircle size={18} />
                  Cancel request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
