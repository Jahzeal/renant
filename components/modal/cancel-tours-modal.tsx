"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";

interface CancelTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  userId: string;
  propertyTitle: string;
  onConfirmCancel: (
    propertyId: string,
    userId: string,
    reason: string
  ) => Promise<void>;
  cancelTourRequest: (propertyId: string, userId: string) => Promise<void>;
}

export function CancelTourModal({
  isOpen,
  onClose,
  propertyId,
  userId,
  propertyTitle,
  onConfirmCancel,
  cancelTourRequest,
}: CancelTourModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await cancelTourRequest(propertyId, userId);
      await onConfirmCancel(propertyId, userId, reason);
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
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Cancel Tour Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to cancel your tour request for{" "}
              <span className="font-semibold">{propertyTitle}</span>?
            </p>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            ></input>
            
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              placeholder="Please provide a reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2.5 px-4 rounded-md transition-colors"
            >
              Keep tour
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
            >
              {isSubmitting ? "Canceling..." : "Cancel tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
