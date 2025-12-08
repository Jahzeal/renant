
import React from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

interface HostelSellCardProps {
  hostelName: string;
  price: string;
  address: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const HostelSellCard: React.FC<HostelSellCardProps> = ({
  hostelName,
  price,
  address,
  isActive = true,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                {hostelName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">{hostelName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isActive ? "Active" : "Paused"}
                </span>
                <span className="text-xs text-muted-foreground">• Your Listing</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold text-primary">{price}</div>
            <p className="text-xs text-muted-foreground mt-1">per night</p>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {address}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition"
          >
            
                Sell
          </button>

          <button
            onClick={onEdit}
            className="p-3 border border-border rounded-xl hover:bg-muted transition"
            aria-label="Edit listing"
          >
            <Edit2 size={18} className="text-foreground" />
          </button>

          <button
            onClick={onDelete}
            className="p-3 border border-destructive/30 rounded-xl hover:bg-destructive/10 transition"
            aria-label="Delete listing"
          >
            <Trash2 size={18} className="text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelSellCard;