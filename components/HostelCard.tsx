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
    <div className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {initial}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">{hostelName}</h3>
              <p className="text-sm text-muted-foreground">by {name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-primary">{price}</div>
            <p className="text-xs text-muted-foreground mt-1">per night</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          Location: {address}
        </p>

        <button className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition">
          Buy
        </button>
      </div>
    </div>
  );
};

export default HostelCard;