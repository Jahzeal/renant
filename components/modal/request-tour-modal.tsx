"use client";

import type React from "react";
import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRenterRequests } from "@/lib/renter-requests-context";

interface RequestTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  listingId: string;
  propertyType: "apartment" | "hostel" | "shortlet";
  onSuccess?: () => void;
  listingPrice?: number;
}

export function RequestTourModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
  propertyType,
  onSuccess,
}: RequestTourModalProps) {
  const router = useRouter();
  const { addTourRequest } = useRenterRequests();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "I'm interested in your property and would like to move forward. Can you show me around?",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Send tour request
      await addTourRequest(listingId);

      // 2️⃣ Redirect after success
      router.push("/manage-tours");

      // 3️⃣ Close modal
      onClose();

      // 4️⃣ Reset form (optional but clean)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message:
          "I'm interested in your property and would like to move forward. Can you show me around?",
      });
    } catch (error) {
      console.error("Failed to send tour request:", error);
      alert("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="md:sticky md:top-0 flex items-center justify-between p-6 border-b bg-white z-10 rounded-t-lg">
          <h2 className="text-2xl font-semibold">Request a tour</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto">
          {success ? (
            /* Success State View */
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Request Sent!
              </h3>
              <p className="text-gray-600">
                Your tour request for <strong>{listingTitle}</strong> has been
                submitted successfully.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 pt-4">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                Redirecting you...
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Property: <span className="font-bold">{listingTitle}</span>
                </p>
              </div> */}

              <div>
                <label className="text-base font-semibold text-gray-900">
                  First & last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-base font-semibold text-gray-900">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-base font-semibold text-gray-900">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter Phone Number"
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-semibold text-gray-900">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 px-4 rounded-md transition-all text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send tour request"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
