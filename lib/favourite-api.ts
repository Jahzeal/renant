// src/lib/favorites-api.ts (New file)

// Ensure API_BASE_URL does not end with a slash to avoid double slashes in URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

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
export async function fetchUserFavorites(): Promise<string[]> {
    const token = getAuthToken();
    if (!token) {
        // If no token, user is logged out, return empty array
        return [];
    }

    const res = await fetch(`${API_BASE_URL}/users/favourite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        // Handle unauthorized or other errors gracefully
        console.error('API Error fetching favorites:', res.status, res.statusText);
        // You might want to throw an error or return an empty array based on desired behavior
        return []; 
    }

    // Assuming the backend returns an array of IDs, e.g., { ids: ["id1", "id2"] }
    const data = await res.json();
    return data.ids || []; 
}

/**
 * 2. Saves the new list of favorite IDs to the backend database.
 */
export async function saveUserFavorites(newFavorites: string[]): Promise<void> {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication required to save favorites.");
    }

    const url = `${API_BASE_URL}/users/favourite/update`;
    const res = await fetch(url, { // Use a dedicated update endpoint
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        // Send the full array of IDs to be saved/overwritten on the backend
        body: JSON.stringify({ ids: newFavorites }), 
    });

    if (!res.ok) {
        let errorMessage = "Failed to save favorites to database.";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // response might not be json
        }

        if (res.status === 404) {
             console.error(`Backend endpoint not found: ${url}. Please ensure the backend is running and the route is registered correctly.`);
        }

        throw new Error(errorMessage);
  }
}
  
  export async function deleteFavorite(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required to delete favorite.");
    }
    const res = await fetch(`${API_BASE_URL}/users/favourite/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete favorite from database.");
    }
  }
