// src/lib/favorites-api.ts (New file)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import {apiRequest} from "@/lib/authenticate"

export type Property = any;

/**
 * Helper to get the token for Authorization header.
 */
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

/**
 * 1. Fetches the current list of favorite IDs for the authenticated user.
 */
export async function fetchUserFavorites(): Promise<any[]> {
    const token = getAuthToken();
    if (!token) return [];

    const res = await apiRequest(`${API_BASE_URL}/users/favourite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res?.ok) {
        console.error('API Error fetching favorites:', res?.statusText);
        return [];
    }

    const data = await res.json();

    // backend returns array of favorites → extract property objects
    return data.map((fav: any) => fav.property);
}


/**
 * 2. Saves the new list of favorite IDs to the backend database.
 */
export async function saveUserFavorites(propertyId: string): Promise<Property> {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const res = await apiRequest(`${API_BASE_URL}/users/favourite/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ propertyId }),
  });

  if (!res) {
    throw new Error("No response from server");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to save favorite");
  }

  const data = await res.json();
  return data.property; // full Property object
}


  
  export async function deleteFavorite(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required to delete favorite.");
    }
    const res = await apiRequest(`${API_BASE_URL}/users/favourite/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res?.ok) {
      const errorData = await res?.json();
      throw new Error(errorData.message || "Failed to delete favorite from database.");
    }
  }