"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";

interface CancelTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  propertyId: string;
  propertyTitle: string;

  // Single backend action
  cancelTourRequest: (
    tourId: string,
    propertyId: string,
    // reason: string,
    // email: string
  ) => Promise<boolean>;
}

export function CancelTourModal({
  isOpen,
  onClose,
  tourId,
  propertyId,
  propertyTitle,
  cancelTourRequest,
}: CancelTourModalProps) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Single backend call (JWT provides userId)
      await cancelTourRequest(tourId, propertyId);

      setEmail("");
      setReason("");
      onClose();
    } catch (error) {
      console.error("Failed to cancel tour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Cancel Tour Request
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to cancel your tour request for{" "}
            <span className="font-semibold text-gray-900">
              {propertyTitle}
            </span>
            ?
          </p>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2.5 rounded-md"
            >
              Keep tour
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-2.5 rounded-md"
            >
              {isSubmitting ? "Canceling..." : "Cancel tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
