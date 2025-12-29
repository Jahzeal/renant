"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRenterRequests } from "@/lib/renter-requests-context";

interface RequestTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  listingId: string;
  propertyType: "apartment" | "hostel" | "shortlet";

  listingPrice?: number;
}

export function RequestTourModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
  propertyType,
}: RequestTourModalProps) {
  const router = useRouter();
  const { addTourRequest } = useRenterRequests();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "I'm interested in your property and would like to move forward. Can you show me around ?",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!/^\d{10,15}$/.test(formData.phone)) {
      alert("Phone number must contain only digits (10–15)");
      return;
    }

    setLoading(true);
    const req = await addTourRequest(listingId);
    setLoading(false);

    if (req) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push("/manage-tours");
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col">
        <div className="md:sticky md:top-0 flex items-center justify-between p-6 border-b bg-white z-10">
          <h2 className="text-2xl font-semibold">Request a tour</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {success && (
          <div className="mx-8 mt-6 rounded-md bg-green-50 border border-green-200 p-4 text-green-700 font-medium">
            Tour request sent successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
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
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Please enter a valid email address"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md ..."
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
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phone: value }));
                }}
                pattern="[0-9]{10,15}"
                title="Phone number should contain only digits (10–15)"
                required
                placeholder="Enter Phone Number"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md ..."
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
              rows={8}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-md transition-colors text-lg"
          >
            {loading ? "Sending..." : "Send tour request"}
          </button>
        </form>
      </div>
    </div>
  );
}
