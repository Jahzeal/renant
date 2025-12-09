// lib/getRentals-api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRentals() {
  try {
    const res = await fetch(`${API_BASE_URL}/rentals/allRentals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ensures fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rentals: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("getRentals() error:", error);
    return [];
  }
}
