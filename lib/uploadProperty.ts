import { apiRequest } from "@/lib/authenticate";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type PropertyTypeLocal = "homes" | "shortlets" | "hostels";

interface PropertyFormData {
  type: PropertyTypeLocal;
  title: string;
  price: string;
  address: string;
  latitude: string;
  longitude: string;
  beds: string;
  baths: string;
  room_type: "room_self_contain" | "2_bedrooms" | "room_parlor" | "3_plus_bedrooms";
  style: string;
  offers: string;
  location: string;
  amenities: string;
  description: string;        // ← This is what your form uses now
  photos: File[];
  priceEntries: { beds: string; price: string }[];
}
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

const mapPropertyType = (type: PropertyTypeLocal) => {
  switch (type) {
    case "homes":
      return "APARTMENT";
    case "shortlets":
      return "SHORTLET";
    case "hostels":
      return "HOSTEL";
    default:
      return "APARTMENT";
  }
};

const mapRoomType = (roomType: string) => {
  switch (roomType) {
    case "room_self_contain":
      return "ROOM_SELF_CONTAIN";
    case "2_bedrooms":
      return "TWO_BEDROOMS";
    case "room_parlor":
      return "ROOM_PARLOUR";
    case "3_plus_bedrooms":
      return "THREE_PLUS_BEDROOMS";
    default:
      return "ROOM_SELF_CONTAIN";
  }
};

export async function uploadProperty(formData: PropertyFormData): Promise<any> {
  const token = getAuthToken();

  if (!token) {
    toast({
      title: "Authentication required",
      description: "Please log in to continue.",
      variant: "destructive",
    });
    throw new Error("Authentication required");
  }

  // Prepare multiple prices (if any)
  const prices = formData.priceEntries
    .map((entry) => ({
      beds: Number(entry.beds),
      price: Number(entry.price),
    }))
    .filter((p) => !isNaN(p.beds) && !isNaN(p.price) && p.beds > 0);

  // If no variable prices, use the single price field as fallback
  if (prices.length === 0 && formData.price) {
    prices.push({
      beds: Number(formData.beds) || 1,
      price: Number(formData.price),
    });
  }

  const dto = {
    title: formData.title.trim(),
    description: formData.description.trim() || formData.about?.trim(),
    type: mapPropertyType(formData.type),
    price: prices, // array of { beds, price }
    address: formData.address.trim(),
    images: formData.photos.map((file) => file.name), // file names (backend will handle upload)
    beds: Number(formData.beds) || 0,
    baths: Number(formData.baths) || 0,
    room_type: mapRoomType(formData.room_type),
    style: formData.style.trim() || "Modern",
    offers: formData.offers.trim() || null,
    location: formData.location.trim() || formData.address.split(",")[0] || "",
    amenities: formData.amenities
      .split(/[\n,]/)
      .map((a) => a.trim())
      .filter(Boolean),
    coords: {
      lat: Number(formData.latitude),
      lng: Number(formData.longitude),
    },
  };

  try {
    toast({
      title: "Uploading property...",
      description: "Please wait while we save your listing.",
    });

    const res = await apiRequest(`${API_BASE_URL}/admin/createproperties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res?.ok) {
      const errorData = await res?.json().catch(() => ({}));
      const message = errorData.message || "Failed to create property";

      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });

      throw new Error(message);
    }

    const data = await res.json();

    toast({
      title: "Success 🎉",
      description: "Property uploaded successfully.",
    });

    // Return the created listing (with image URLs if backend provides them)
    return data;
  } catch (error: any) {
    toast({
      title: "Upload failed",
      description: error.message || "Something went wrong.",
      variant: "destructive",
    });
    throw error;
  }
}