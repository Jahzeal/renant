// components/HostelSellCard.tsx
import React from "react";

interface HostelSellCardProps {
  hostelName: string;
  price: string;
  address: string;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const HostelSellCard: React.FC<HostelSellCardProps> = ({
  hostelName,
  price,
  address,
  isActive,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground">{hostelName}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{price}</p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium truncate">{address}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-3 bg-red-500/10 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-500/20 transition"
          >
            Delete
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default HostelSellCard;