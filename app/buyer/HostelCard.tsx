// components/HostelCard.tsx
"use client";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface HostelCardProps {
  hostelName: string;
  price: string;
  address: string;
  name: string;
  images: string[]; // Array of base64 or uploaded image URLs
  rating?: number;
  reviewCount?: number;
}

export default function HostelCard({
  hostelName,
  price,
  address,
  name,
  images = [],
  rating = 4.8,
  reviewCount = 48,
}: HostelCardProps) {
  const mainImage = images[0] || null;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={hostelName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-blue-600 font-medium">No Image</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg">
            {price}
          </Badge>
        </div>

        {/* Image Count Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/20 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            +{images.length - 1} more
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground line-clamp-1">
            {hostelName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">by {name}</p>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground line-clamp-2">
            {address}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{rating}</span>
            <span className="text-sm text-muted-foreground ml-1">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
          View & Buy
        </button>
      </div>
    </Card>
  );
}
