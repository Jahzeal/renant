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


export async function filterRentals(filters: Record<string, any>) {
  try {
    // Handle "All types" for propertyType by converting it to undefined
    if (filters.propertyType === "All types") {
      filters.propertyType = undefined;
    }

    // Remove undefined or null values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    );

    const res = await fetch(`${API_BASE_URL}/rentals/filterRentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanFilters),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Filter API error:", await res.text());
      throw new Error(`Failed to fetch filtered rentals: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("filterRentals() error:", error);
    return [];
  }
}




