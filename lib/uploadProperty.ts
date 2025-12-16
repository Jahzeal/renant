import { apiRequest } from "@/lib/authenticate"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type PropertyTypeLocal = "homes" | "shortlets" | "hostels"

interface PropertyFormData {
  type: PropertyTypeLocal
  title: string
  price: string
  address: string
  latitude: string
  longitude: string
  beds: string
  baths: string
  amenities: string
  about: string
  photos: File[]
}


const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}


const mapPropertyType = (type: PropertyTypeLocal) => {
  switch (type) {
    case "homes":
      return "APARTMENT"
    case "shortlets":
      return "ShortLET"
    case "hostels":
      return "Hostels"
    default:
      return "APARTMENT"
  }
}

export async function uploadProperty(formData: PropertyFormData): Promise<any> {
  const token = getAuthToken()
  if (!token) throw new Error("Authentication required")

  // Convert price and beds/baths to correct types for DTO
  const dto = {
    title: formData.title,
    description: formData.about,
    type: mapPropertyType(formData.type),
    price: [{ amount: Number(formData.price) }],
    address: formData.address,
    images: formData.photos.map((file) => file.name), 
    beds: Number(formData.beds),
    baths: Number(formData.baths),
    typerooms: "N/A",
    amenities: formData.amenities.split(",").map((a) => a.trim()),
    offers: "",
    location: formData.address,
    coords: {
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    },
  }

  const res = await apiRequest(`${API_BASE_URL}/admin/createproperties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  })

  if (!res?.ok) {
    const errorData = await res?.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to upload property")
  }

  const data = await res.json()
  return data
}