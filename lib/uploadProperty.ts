const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface PropertyUploadData {
  type: string
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

export async function uploadProperty(
  propertyData: Omit<PropertyUploadData, "photos"> & { photos: File[] }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured")
    }

    // ✅ Convert & validate coords
    const latitude = JSON.parse(propertyData.latitude)
    const longitude = JSON.parse(propertyData.longitude)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Invalid latitude or longitude")
    }

    const formData = new FormData()

    // ✅ Append normalized fields
    formData.append("type", propertyData.type)
    formData.append("title", propertyData.title)
    formData.append("price", String(Number(propertyData.price) || 0))
    formData.append("address", propertyData.address)
    formData.append("latitude", String(latitude))
    formData.append("longitude", String(longitude))
    formData.append("beds", String(Number(propertyData.beds) || 0))
    formData.append("baths", String(Number(propertyData.baths) || 0))
    formData.append("amenities", propertyData.amenities)
    formData.append("about", propertyData.about)

    // ✅ Append photos correctly
    propertyData.photos.forEach((photo) => {
      formData.append("photos", photo)
    })

    const token = getAuthToken()

    console.log(" Uploading property to:", `${API_BASE_URL}/admin/createproperties`)

    const response = await fetch(`${API_BASE_URL}/admin/createproperties`, {
      method: "POST",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(" Upload API error:", errorText)
      throw new Error(`Failed to upload property: ${response.status}`)
    }

    const data = await response.json()
    console.log(" Property uploaded successfully:", data)
    return data
  } catch (error) {
    console.error(" uploadProperty error:", error)
    throw error
  }
}
