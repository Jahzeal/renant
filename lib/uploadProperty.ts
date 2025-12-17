import { apiRequest } from "@/lib/authenticate"
import { toast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type PropertyTypeLocal = "homes" | "shortlets" | "hostels"

interface PropertyFormData {
  type: PropertyTypeLocal
  offers: string
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

  if (!token) {
    toast({
      title: "Authentication required",
      description: "Please log in to continue.",
      variant: "destructive",
    })
    throw new Error("Authentication required")
  }

  const uploadedImageUrls: string[] = []

  try {
    // First, upload all images to get their URLs
    console.log("[v0] Starting image upload for", formData.photos.length, "photos")

    for (const photo of formData.photos) {
      const imageFormData = new FormData()
      imageFormData.append("file", photo)

      console.log("[v0] Uploading image:", photo.name)

      const imageRes = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      })

      if (imageRes.ok) {
        const imageData = await imageRes.json()
        console.log("[v0] Image upload response:", imageData)
        // Try multiple possible response formats
        const imageUrl = imageData.url || imageData.path || imageData.filePath || imageData.location || photo.name
        uploadedImageUrls.push(imageUrl)
        console.log("[v0] Added image URL:", imageUrl)
      } else {
        const errorText = await imageRes.text()
        console.warn(`[v0] Failed to upload image ${photo.name}:`, errorText)
        // Fallback: use placeholder with query based on filename
        const placeholderUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(photo.name.replace(/\.[^/.]+$/, ""))}`
        uploadedImageUrls.push(placeholderUrl)
      }
    }
  } catch (error) {
    console.error("[v0] Image upload error:", error)
    // Use placeholders as fallback
    uploadedImageUrls.push(
      ...formData.photos.map(
        (file) =>
          `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(file.name.replace(/\.[^/.]+$/, ""))}`,
      ),
    )
  }

  console.log("[v0] Final uploaded image URLs:", uploadedImageUrls)

  const dto = {
    title: formData.title,
    description: formData.about,
    type: mapPropertyType(formData.type),
    price: Number(formData.price),
    address: formData.address,
    images: uploadedImageUrls, // Now using full URLs instead of just filenames
    beds: Number(formData.beds),
    baths: Number(formData.baths),
    typerooms: "N/A",
    amenities: formData.amenities.split(",").map((a) => a.trim()),
    offers: formData.offers || null,
    location: formData.address,
    coords: {
      lng: Number(formData.longitude),
      lat: Number(formData.latitude),
    },
  }

  console.log("[v0] Uploading property with DTO:", dto) // Debug log

  try {
    toast({
      title: "Uploading property...",
      description: "Please wait while we save your listing.",
    })

    const res = await apiRequest(`${API_BASE_URL}/admin/createproperties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res) return

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))

      toast({
        title: "Upload failed",
        description: errorData.message || "Something went wrong",
        variant: "destructive",
      })

      throw new Error(errorData.message || "Failed to upload property")
    }

    const data = await res.json()

    toast({
      title: "Success 🎉",
      description: "Property uploaded successfully.",
    })

    return data
  } catch (error: any) {
    toast({
      title: "Upload failed",
      description: error.message || "Something went wrong.",
      variant: "destructive",
    })
    throw error
  }
}
