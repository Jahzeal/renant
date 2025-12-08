import React from "react";

interface HostelCardProps {
  name: string;
  hostelName: string;
  price: string;
  address: string;
}

const HostelCard: React.FC<HostelCardProps> = ({ name, hostelName, price, address }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="group relative bg-card rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-border overflow-hidden cursor-pointer">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg ring-4 ring-primary/20">
                {initial}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
            </div>

            {/* Name & Hostel */}
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold text-foreground leading-tight truncate">
                {hostelName}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                  {name}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Verified Seller
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-extrabold text-primary whitespace-nowrap">
              {price}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium truncate">{address}</span>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-primary text-primary-foreground font-bold text-base py-4 rounded-xl hover:bg-primary/90 active:scale-95 transform transition-all duration-200 shadow-lg hover:shadow-primary/25">
          Buy Now
        </button>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default HostelCard;