// components/modal/post-hostel-modal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PostHostelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { hostelName: string; price: string; address: string }) => void;
}

export default function PostHostelModal({ isOpen, onClose, onSubmit }: PostHostelModalProps) {
  const [hostelName, setHostelName] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!hostelName || !price || !address) {
      setError("Please fill in all fields");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    onSubmit({ hostelName, price, address });
    setHostelName("");
    setPrice("");
    setAddress("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-t-3xl md:rounded-2xl shadow-2xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Post Hostel for Sale</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Hostel Name
              </label>
              <input
                type="text"
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                placeholder="e.g. Victory Lodge"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price per Night (₦)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 5500"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 24, Ikorodu Rd, Lagos"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="flex gap-3 p-6 border-t border-border bg-muted/50">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 border border-border font-medium rounded-xl hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition"
            >
              Post Listing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}