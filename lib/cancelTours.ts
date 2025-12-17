// src/lib/tours-api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
import { apiRequest } from "@/lib/authenticate"

const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export async function cancelTourRequest(tourRequestId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Authentication required to cancel tour request.")
  }

  const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours/${tourRequestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res) {
    throw new Error("No response from server")
  }

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to cancel tour request")
  }
}
