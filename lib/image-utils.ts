// Ensure this matches the backend URL provided by the user
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rentcom-3.onrender.com"

/**
 * Normalizes an image path to a full URL.
 * If the path is already a full URL (http/https), returns it as is.
 * Otherwise, prepends the API base URL.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "/placeholder.svg?height=300&width=400&query=home"

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path

  // Ensure we don't end up with undefined/null in the URL
  if (API_BASE_URL) {
      // Remove trailing slash from API_BASE_URL if present
      const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
      return `${baseUrl}/${cleanPath}`
  }

  // Fallback if no API URL is set (though we have a default above)
  return `/${cleanPath}`
}
