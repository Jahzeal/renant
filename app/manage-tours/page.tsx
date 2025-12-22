"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, XCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { useRenterRequests } from "@/lib/renter-requests-context";
import { CancelTourModal } from "@/components/modal/cancel-tours-modal";

export default function ManageToursPage() {
  const { tourRequests, cancelTourRequest } = useRenterRequests();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<{
    tourId: string;
    propertyId: string;
    title: string;
  } | null>(null);

  const handleCancelClick = (
    tourId: string,
    propertyId: string,
    title: string
  ) => {
    setSelectedTour({ tourId, propertyId, title });
    setCancelModalOpen(true);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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

              <Link
                href="/how-it-works"
                className="pb-2 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                How it works
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
                className="flex flex-col sm:flex-row justify-between gap-4 border rounded-lg p-4"
              >
                {/* Info */}
                <div>
                  <h3 className="font-semibold text-lg">
                    {request.propertyTitle}
                  </h3>

                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    {request.propertyPrice && (
                      <span>₦{request.propertyPrice}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Cancel */}
                <button
                  onClick={() =>
                    handleCancelClick(
                      request.id, // tourId
                      request.propertyId,
                      request.propertyTitle
                    )
                  }
                  className="flex items-center gap-2 text-sm text-destructive hover:underline"
                >
                  <XCircle size={18} />
                  Cancel request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {selectedTour && (
        <CancelTourModal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setSelectedTour(null);
          }}
          tourId={selectedTour.tourId}
          propertyId={selectedTour.propertyId}
          propertyTitle={selectedTour.title}
          cancelTourRequest={cancelTourRequest}
        />
      )}
    </div>
  );
}
