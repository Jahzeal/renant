"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRenterRequests } from "@/lib/renter-requests-context";
// import emailjs from "@emailjs/browser"; // <-- Commented out for now

interface RequestToApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  listingId: string;
  listingPrice?: number;
}

export function RequestToApplyModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
}: RequestToApplyModalProps) {
  const router = useRouter();
  const { requestToApply } = useRenterRequests();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in your property and would like to move forward.`,
  });
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

    try {
      // 1️⃣ Send property to backend (DB)
      await requestToApply(listingId);

      // 2️⃣ Send full form + property info to email (commented out for now)
      /*
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          ...formData,
          propertyTitle: listingTitle,
          propertyId: listingId,
          propertyPrice: listingPrice || "N/A",
        },
        "YOUR_PUBLIC_KEY"
      );
      */
      if (!isValidEmail(formData.email)) {
        alert("Please enter a valid email address");
        return;
      }

      if (!/^\d{10,15}$/.test(formData.phone)) {
        alert("Phone number must contain only digits (10–15)");
        return;
      }
      router.push("/renter-hub");
      onClose();

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `I'm interested in your property and would like to move forward.`,
      });
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col">
        <div className="md:sticky md:top-0 flex items-center justify-between p-6 border-b bg-white z-10">
          <h2 className="text-2xl font-semibold">Request to apply</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-6"
        >
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Email</label>
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
              <label>Phone</label>
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
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
          >
            Send request
          </button>
        </form>
      </div>
    </div>
  );
}
